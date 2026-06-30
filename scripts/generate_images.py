import csv
import json
import os

def generate_image_prompts(csv_path, city):
    prompts = []
    with open(csv_path, mode='r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        for row in reader:
            id = row['id']
            name = row['name']
            description = row['description']
            
            # Construct a prompt based on name and description
            prompt = f"A photo of a restaurant named '{name}' in {city.capitalize()}. {description}"
            
            output_path = f"frontend/public/images/{city}/{city}_{id}.jpg"
            
            prompts.append({
                "id": id,
                "prompt": prompt,
                "output_path": output_path
            })
            
    return prompts

if __name__ == "__main__":
    city = "sevilla"
    csv_path = f'database/seed_data_{city}.csv'
    
    print(f"Reading {csv_path} to generate image prompts...")
    instructions = generate_image_prompts(csv_path, city)
    
    output_json = f'scripts/image_gen_instructions_{city}.json'
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(instructions, f, indent=2, ensure_ascii=False)
        
    print(f"Instructions saved to {output_json}")
    print(f"Total instructions: {len(instructions)}")
