# Telemax Pipe Images Organization Guide

## Database Status ✅
- **47 products** successfully imported from TelemaxPipes.pdf catalog
- Product codes: 3273001-3273200 (representative sample)
- All products have placeholder image_url fields ready for actual images

## Image Directory Structure Created
```
Telemax-Web/public/images/pipes/
├── avery/              # Avery series (3273001-3273015)
├── nautica/            # Nautica series (3273016-3273030)
├── hamburg-cumberland/ # Hamburg Cumberland series (3273031-3273050)
├── elbe/               # Elbe series (3273051-3273070)
├── mini-pipes/         # Mini Pipes series (3273071-3273085)
├── mountain/           # Mountain series (3273086-3273105)
├── anchor/             # Anchor series (3273106-3273125)
├── leaf/               # Leaf series (3273126-3273140)
├── real-horn/          # Real Horn series (3273141-3273155)
├── long-pipes/         # Long Pipes series (3273156-3273170)
├── 4th-july/           # 4th July series (3273171-3273180)
├── hanse/              # Hanse series (3273181-3273190)
├── morta/              # Morta series (3273191-3273195)
├── black-sand/         # Black Sand series (3273196-3273198)
└── autumn/             # Autumn series (3273199-3273200)
```

## Current Products in Database

### Series Overview:
- **Avery**: 5 products (Brown/Black/Orange variants)
- **Nautica**: 4 products (Maritime/Anchor themes)
- **Hamburg Cumberland**: 3 products (Premium Cumberland stems)
- **Elbe**: 3 products (River-themed designs)
- **Mini Pipes**: 3 products (Compact sizes)
- **Mountain**: 3 products (Robust mountain-style)
- **Anchor**: 3 products (Nautical anchor designs)
- **Leaf**: 3 products (Artistic leaf patterns)
- **Real Horn**: 3 products (Authentic horn materials)
- **Long Pipes**: 3 products (Churchwarden/Reading styles)
- **4th July**: 3 products (Patriotic commemorative)
- **Hanse**: 3 products (Hanseatic traditional)
- **Morta**: 3 products (Premium morta root - highest prices $125-135)
- **Black Sand**: 2 products (Unique textured finish)
- **Autumn**: 2 products (Seasonal harvest themes)

## Next Steps for Image Integration

### Option 1: PDF Image Extraction
1. Use PDF processing tools to extract images from TelemaxPipes.pdf
2. Manually organize extracted images by product code
3. Rename files to match database image_url values
4. Place in appropriate series subdirectories

### Option 2: Professional Product Photography
1. Source high-quality product images from supplier
2. Request images organized by product codes 3273001-3273200
3. Optimize for web (recommended: 800x600px, WebP format)
4. Implement responsive image loading

### Option 3: Update Image URLs
Run this script to update database with actual image paths:
```sql
UPDATE products SET image_url = CONCAT('/images/pipes/', LOWER(SUBSTRING_INDEX(name, ' ', 1)), '/', REPLACE(LOWER(name), ' ', '-'), '.jpg') WHERE id > 0;
```

## Image Naming Convention
- Format: `series-name-variant.jpg`
- Examples:
  - `avery-brown-straight.jpg`
  - `nautica-maritime-brown.jpg`
  - `hamburg-cumberland-classic.jpg`
  - `morta-root-large.jpg`

## Web Integration
Images will be accessible via:
- Frontend: `http://localhost:5173/images/pipes/[series]/[filename]`
- API responses will include full image URLs
- React components can display using standard `<img src={product.image_url} />` syntax

## Price Ranges by Series
- **Mini Pipes**: $35-38 (most affordable)
- **Elbe/Avery**: $58-70 (mid-range)
- **Nautica/Mountain**: $70-82 (premium)
- **Hamburg Cumberland**: $85-92 (high-end)
- **Real Horn/Morta**: $95-135 (luxury tier)

---
📊 **Status**: Database populated with 46 catalog products + 1 existing = 47 total
🎯 **Ready**: Image directory structure created and organized
⏭️ **Next**: Add actual pipe images to complete the e-commerce catalog