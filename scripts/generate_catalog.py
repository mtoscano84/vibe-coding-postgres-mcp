import csv
import os
import random

def generate_image_with_nano_bana(city, id):
    """
    Returns the expected path for the image.
    Uses the public GCS bucket for the CodeLab by default.
    """
    bucket_name = os.environ.get("GCS_BUCKET_NAME", "vibe-coding-berlin-images")
    return f"https://storage.googleapis.com/{bucket_name}/images/{city}/{city}_{id}.jpg"

def generate_data(city):
    if city != "berlin":
        raise ValueError(f"Unsupported city: {city}")

    neighborhoods = ["Kreuzberg", "Mitte", "Neukölln", "Prenzlauer Berg", "Friedrichshain", "Schöneberg", "Charlottenburg", "Wedding"]
    reasons = [
        "celebrate a production release with the team",
        "an unforgettable first date",
        "grab a kebab after a night out",
        "a fancy Sunday brunch",
        "escape the winter cold"
    ]
    foods = [
        "döner kebab with garlic sauce",
        "classic currywurst with fries",
        "crispy veal schnitzel",
        "warm pretzel with butter",
        "local craft beer",
        "modern vegan brunch"
    ]
    names_base = [
        "Mustafa's", "Burgermeister", "Konnopke's", "Prater", "Hofbräu",
        "Clärchens", "Zur Letzten Instanz", "Monsieur Vuong", "Bierhof", "Späti Oasis",
        "Curry 36", "Lia's Kitchen", "Standard Pizza", "Zeit für Brot", "Five Elephant",
        "Ryu Ramen", "Shiso Burger", "District Mot", "Angry Chicken", "Gözleme House",
        "Brammibal's Donuts", "Dudu", "Cocolo Ramen", "Markthalle Neun", "Goldies"
    ]

    categories = ["Tavern", "Cafe", "Restaurant", "Bistro", "Bakery", "Pub", "Gastrobar", "Brewery"]
    adjectives = ["authentic", "modern", "traditional", "cozy", "vibrant", "hidden", "popular", "elegant", "gritty", "trendy"]
    nouns = ["corner", "spot", "place", "temple", "oasis", "nook", "yard", "patio"]
    
    descriptions_templates = [
        "An {adj} {noun} in the heart of {neigh}, ideal to {reason}.",
        "The best option in {neigh} to enjoy {food} with friends.",
        "Famous for its {food} and its {adj} vibe. A must-visit in {neigh}.",
        "A classic {neigh} spot that never disappoints. Perfect to {reason}.",
        "Discover this {adj} {noun} where the specialty is {food}."
    ]
    
    data = []
    generated_names = set()
    
    count = 0
    while count < 100:
        name = f"{random.choice(categories)} {random.choice(names_base)}"
        if name in generated_names:
            continue
        generated_names.add(name)
        
        category = random.choice(categories)
        neighborhood = random.choice(neighborhoods)
        
        template = random.choice(descriptions_templates)
        description = template.format(
            adj=random.choice(adjectives),
            noun=random.choice(nouns),
            neigh=neighborhood,
            reason=random.choice(reasons),
            food=random.choice(foods)
        )
        
        image_path = generate_image_with_nano_bana(city, count + 1)
        
        data.append({
            "id": count + 1,
            "name": name,
            "description": description,
            "category": category,
            "neighborhood": neighborhood,
            "image_path": image_path
        })
        count += 1
        
    return data

def save_to_csv(data, filename):
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    keys = data[0].keys()
    with open(filename, 'w', newline='', encoding='utf-8') as output_file:
        dict_writer = csv.DictWriter(output_file, fieldnames=keys)
        dict_writer.writeheader()
        dict_writer.writerows(data)

if __name__ == "__main__":
    city = "berlin"
    print(f"Generating 100 synthetic records for {city.capitalize()} Gastronomy Guide...")
    catalog_data = generate_data(city)
    
    csv_path = f'database/seed_data_{city}.csv'
    save_to_csv(catalog_data, csv_path)
    print(f"Data saved to {csv_path}")
    print(f"Generated {len(catalog_data)} records.")
