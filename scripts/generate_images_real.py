import csv
import os
from google import genai
from google.genai import types

def generate_images(csv_path, city):
    # Initialize the GenAI client with Vertex AI enabled
    # It will automatically detect your active project and credentials
    client = genai.Client(vertexai=True)
    
    with open(csv_path, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            id = row['id']
            name = row['name']
            description = row['description']
            
            prompt = f"A photo of a restaurant named '{name}' in {city.capitalize()}. {description}"
            
            output_path = f"frontend/public/images/{city}/{city}_{id}.jpg"
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            if os.path.exists(output_path):
                print(f"Image already exists for {name}, skipping.")
                continue
                
            print(f"Generating image for {name}...")
            try:
                result = client.models.generate_images(
                    model='imagen-3.0-generate-002',
                    prompt=prompt,
                    config=types.GenerateImagesConfig(
                        number_of_images=1,
                        output_mime_type="image/jpeg",
                        aspect_ratio="4:3",
                    )
                )
                
                for generated_image in result.generated_images:
                    with open(output_path, 'wb') as f:
                        f.write(generated_image.image.image_bytes)
                print(f"Saved to {output_path}")
            except Exception as e:
                print(f"Failed to generate image for {name}: {e}")

if __name__ == "__main__":
    cities = ["berlin"]
    
    for city in cities:
        csv_path = f'database/seed_data_{city}.csv'
        if os.path.exists(csv_path):
            print(f"Processing images for {city.capitalize()}...")
            generate_images(csv_path, city)
        else:
            print(f"CSV file not found: {csv_path}")
