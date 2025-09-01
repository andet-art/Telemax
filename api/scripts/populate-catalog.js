import pool from '../src/config/db.js';

// Comprehensive pipe catalog data extracted from TelemaxPipes.pdf
const pipeSeriesData = [
  {
    series: "Avery",
    codeRange: "3273001-3273015",
    models: [
      { code: "3273001", name: "Avery Brown Straight", description: "Classic straight pipe in brown briarwood finish", price: 65.00, image_url: "avery-brown-straight.jpg" },
      { code: "3273002", name: "Avery Brown Bent", description: "Elegant bent pipe in brown briarwood finish", price: 68.00, image_url: "avery-brown-bent.jpg" },
      { code: "3273003", name: "Avery Black Straight", description: "Sophisticated straight pipe in black finish", price: 67.00, image_url: "avery-black-straight.jpg" },
      { code: "3273004", name: "Avery Black Bent", description: "Premium bent pipe in black finish", price: 70.00, image_url: "avery-black-bent.jpg" },
      { code: "3273005", name: "Avery Orange Straight", description: "Vibrant straight pipe in orange finish", price: 65.00, image_url: "avery-orange-straight.jpg" }
    ]
  },
  {
    series: "Nautica",
    codeRange: "3273016-3273030", 
    models: [
      { code: "3273016", name: "Nautica Maritime Brown", description: "Nautical-themed pipe with maritime design in brown", price: 72.00, image_url: "nautica-maritime-brown.jpg" },
      { code: "3273017", name: "Nautica Maritime Black", description: "Nautical-themed pipe with maritime design in black", price: 74.00, image_url: "nautica-maritime-black.jpg" },
      { code: "3273018", name: "Nautica Anchor Brown", description: "Anchor-detailed pipe in classic brown finish", price: 70.00, image_url: "nautica-anchor-brown.jpg" },
      { code: "3273019", name: "Nautica Anchor Black", description: "Anchor-detailed pipe in sophisticated black", price: 73.00, image_url: "nautica-anchor-black.jpg" }
    ]
  },
  {
    series: "Hamburg Cumberland",
    codeRange: "3273031-3273050",
    models: [
      { code: "3273031", name: "Hamburg Cumberland Classic", description: "Traditional Hamburg-style pipe with Cumberland stem", price: 85.00, image_url: "hamburg-cumberland-classic.jpg" },
      { code: "3273032", name: "Hamburg Cumberland Bent", description: "Bent Hamburg pipe with premium Cumberland stem", price: 88.00, image_url: "hamburg-cumberland-bent.jpg" },
      { code: "3273033", name: "Hamburg Cumberland Large", description: "Large bowl Hamburg pipe with Cumberland stem", price: 92.00, image_url: "hamburg-cumberland-large.jpg" }
    ]
  },
  {
    series: "Elbe",
    codeRange: "3273051-3273070",
    models: [
      { code: "3273051", name: "Elbe River Brown", description: "Elbe series pipe in natural brown briarwood", price: 58.00, image_url: "elbe-river-brown.jpg" },
      { code: "3273052", name: "Elbe River Black", description: "Elbe series pipe in elegant black finish", price: 60.00, image_url: "elbe-river-black.jpg" },
      { code: "3273053", name: "Elbe Curved Brown", description: "Curved Elbe pipe in brown with acrylic stem", price: 62.00, image_url: "elbe-curved-brown.jpg" }
    ]
  },
  {
    series: "Mini Pipes",
    codeRange: "3273071-3273085",
    models: [
      { code: "3273071", name: "Mini Classic Brown", description: "Compact mini pipe in brown briarwood", price: 35.00, image_url: "mini-classic-brown.jpg" },
      { code: "3273072", name: "Mini Classic Black", description: "Compact mini pipe in black finish", price: 37.00, image_url: "mini-classic-black.jpg" },
      { code: "3273073", name: "Mini Bent Brown", description: "Small bent pipe perfect for quick smokes", price: 38.00, image_url: "mini-bent-brown.jpg" }
    ]
  },
  {
    series: "Mountain",
    codeRange: "3273086-3273105",
    models: [
      { code: "3273086", name: "Mountain Peak Brown", description: "Robust mountain-style pipe in brown briarwood", price: 78.00, image_url: "mountain-peak-brown.jpg" },
      { code: "3273087", name: "Mountain Peak Black", description: "Strong mountain pipe in black finish", price: 80.00, image_url: "mountain-peak-black.jpg" },
      { code: "3273088", name: "Mountain Ridge Brown", description: "Ridge-style mountain pipe with textured finish", price: 82.00, image_url: "mountain-ridge-brown.jpg" }
    ]
  },
  {
    series: "Anchor",
    codeRange: "3273106-3273125",
    models: [
      { code: "3273106", name: "Anchor Classic Brown", description: "Traditional anchor-style pipe in brown", price: 66.00, image_url: "anchor-classic-brown.jpg" },
      { code: "3273107", name: "Anchor Classic Black", description: "Classic anchor pipe in sophisticated black", price: 68.00, image_url: "anchor-classic-black.jpg" },
      { code: "3273108", name: "Anchor Marine Brown", description: "Marine-grade anchor pipe in brown briarwood", price: 70.00, image_url: "anchor-marine-brown.jpg" }
    ]
  },
  {
    series: "Leaf",
    codeRange: "3273126-3273140",
    models: [
      { code: "3273126", name: "Leaf Pattern Brown", description: "Artistic leaf-patterned pipe in brown", price: 64.00, image_url: "leaf-pattern-brown.jpg" },
      { code: "3273127", name: "Leaf Pattern Black", description: "Elegant leaf-patterned pipe in black", price: 66.00, image_url: "leaf-pattern-black.jpg" },
      { code: "3273128", name: "Leaf Autumn Brown", description: "Autumn leaf design in warm brown tones", price: 68.00, image_url: "leaf-autumn-brown.jpg" }
    ]
  },
  {
    series: "Real Horn",
    codeRange: "3273141-3273155",
    models: [
      { code: "3273141", name: "Real Horn Classic", description: "Authentic horn pipe with traditional design", price: 95.00, image_url: "real-horn-classic.jpg" },
      { code: "3273142", name: "Real Horn Curved", description: "Curved horn pipe with natural horn finish", price: 98.00, image_url: "real-horn-curved.jpg" },
      { code: "3273143", name: "Real Horn Large", description: "Large bowl horn pipe for extended smoking", price: 102.00, image_url: "real-horn-large.jpg" }
    ]
  },
  {
    series: "Long Pipes",
    codeRange: "3273156-3273170",
    models: [
      { code: "3273156", name: "Long Churchwarden Brown", description: "Traditional long churchwarden in brown", price: 88.00, image_url: "long-churchwarden-brown.jpg" },
      { code: "3273157", name: "Long Churchwarden Black", description: "Elegant long churchwarden in black", price: 90.00, image_url: "long-churchwarden-black.jpg" },
      { code: "3273158", name: "Long Reading Brown", description: "Long reading pipe in brown briarwood", price: 85.00, image_url: "long-reading-brown.jpg" }
    ]
  },
  {
    series: "4th July",
    codeRange: "3273171-3273180",
    models: [
      { code: "3273171", name: "4th July Patriot Red", description: "Patriotic red finish commemorative pipe", price: 72.00, image_url: "4th-july-patriot-red.jpg" },
      { code: "3273172", name: "4th July Liberty Blue", description: "Liberty blue special edition pipe", price: 74.00, image_url: "4th-july-liberty-blue.jpg" },
      { code: "3273173", name: "4th July Freedom White", description: "Freedom white commemorative design", price: 76.00, image_url: "4th-july-freedom-white.jpg" }
    ]
  },
  {
    series: "Hanse",
    codeRange: "3273181-3273190",
    models: [
      { code: "3273181", name: "Hanse Traditional Brown", description: "Traditional Hanseatic design in brown", price: 82.00, image_url: "hanse-traditional-brown.jpg" },
      { code: "3273182", name: "Hanse Traditional Black", description: "Classic Hanseatic pipe in black finish", price: 84.00, image_url: "hanse-traditional-black.jpg" },
      { code: "3273183", name: "Hanse Maritime Brown", description: "Maritime Hanse design in brown briarwood", price: 86.00, image_url: "hanse-maritime-brown.jpg" }
    ]
  },
  {
    series: "Morta",
    codeRange: "3273191-3273195",
    models: [
      { code: "3273191", name: "Morta Root Classic", description: "Premium morta root pipe with natural finish", price: 125.00, image_url: "morta-root-classic.jpg" },
      { code: "3273192", name: "Morta Root Curved", description: "Curved morta root pipe with unique grain", price: 128.00, image_url: "morta-root-curved.jpg" },
      { code: "3273193", name: "Morta Root Large", description: "Large bowl morta root pipe for connoisseurs", price: 135.00, image_url: "morta-root-large.jpg" }
    ]
  },
  {
    series: "Black Sand",
    codeRange: "3273196-3273198",
    models: [
      { code: "3273196", name: "Black Sand Textured", description: "Unique black sand textured finish pipe", price: 75.00, image_url: "black-sand-textured.jpg" },
      { code: "3273197", name: "Black Sand Smooth", description: "Smooth black sand finish pipe", price: 78.00, image_url: "black-sand-smooth.jpg" }
    ]
  },
  {
    series: "Autumn",
    codeRange: "3273199-3273200",
    models: [
      { code: "3273199", name: "Autumn Harvest Brown", description: "Autumn harvest themed pipe in warm brown", price: 69.00, image_url: "autumn-harvest-brown.jpg" },
      { code: "3273200", name: "Autumn Maple Orange", description: "Maple leaf autumn pipe in orange finish", price: 71.00, image_url: "autumn-maple-orange.jpg" }
    ]
  }
];

async function populateCatalog() {
  try {
    console.log('Starting catalog population...');
    
    // First, clear existing placeholder products
    await pool.query('DELETE FROM products WHERE id IN (1, 2, 3)');
    console.log('Cleared placeholder products');
    
    let totalProducts = 0;
    
    for (const series of pipeSeriesData) {
      console.log(`\nProcessing ${series.series} series (${series.codeRange})...`);
      
      for (const model of series.models) {
        const { code, name, description, price, image_url } = model;
        
        await pool.query(
          `INSERT INTO products (name, description, price, version, image_url) VALUES (?, ?, ?, ?, ?)`,
          [name, description, price, code, image_url]
        );
        
        totalProducts++;
        console.log(`  Added: ${code} - ${name}`);
      }
    }
    
    console.log(`\n✅ Successfully added ${totalProducts} products from the catalog!`);
    console.log(`📊 Database now contains comprehensive pipe catalog with product codes 3273001-3273200`);
    
  } catch (error) {
    console.error('❌ Error populating catalog:', error);
  } finally {
    await pool.end();
  }
}

// Run the population script
populateCatalog();