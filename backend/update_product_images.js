import { supabase } from './config/supabaseClient.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// Image mappings for each category
const imageMappings = {
  snacks: [
    '/organic-millets-mix.jpg',
    '/sunflower-oil-bottle.jpg',
    '/basmati-rice-1kg.jpg',
    '/wheat-flour-bag.png'
  ],
  chocolates: [
    '/chocolate-placeholder.svg',
    '/chocolate-placeholder.svg',
    '/chocolate-placeholder.svg',
    '/chocolate-placeholder.svg'
  ],
  utensils: [
    '/non-stick-frying-pan.jpg',
    '/pressure-cooker-stainless-steel.jpg',
    '/mixing-bowls-stainless-steel-set.jpg',
    '/kitchen-knife-set-professional.jpg'
  ],
  cosmetics: [
    '/cosmetics-placeholder.svg',
    '/cosmetics-placeholder.svg',
    '/cosmetics-placeholder.svg',
    '/cosmetics-placeholder.svg'
  ],
  dry_fruits: [
    '/organic-millets-mix.jpg',
    '/sunflower-oil-bottle.jpg',
    '/placeholder.svg',
    '/placeholder.svg'
  ],
  plastic_items: [
    '/products/storage-containers.jpg',
    '/placeholder.svg',
    '/trash-bin-with-lid.jpg',
    '/placeholder.svg'
  ],
  appliances: [
    '/pressure-cooker-stainless-steel.jpg',
    '/non-stick-frying-pan.jpg',
    '/placeholder.svg',
    '/placeholder.svg'
  ]
};

async function updateProductImages() {
  console.log('🖼️  Updating product images...');
  
  try {
    for (const [category, images] of Object.entries(imageMappings)) {
      console.log(`\n📦 Updating ${category} products...`);
      
      const { data: products, error: fetchError } = await supabase
        .from(category)
        .select('*');
      
      if (fetchError) {
        console.error(`❌ Error fetching ${category}:`, fetchError.message);
        continue;
      }
      
      if (!products || products.length === 0) {
        console.log(`   No products found in ${category}`);
        continue;
      }
      
      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const imageUrl = images[i % images.length]; // Cycle through available images
        
        const { error: updateError } = await supabase
          .from(category)
          .update({ image_url: imageUrl })
          .eq('id', product.id);
        
        if (updateError) {
          console.error(`   ❌ Error updating ${product.name}:`, updateError.message);
        } else {
          console.log(`   ✅ Updated ${product.name} with ${imageUrl}`);
        }
      }
    }
    
    console.log('\n🎉 Product images updated successfully!');
  } catch (error) {
    console.error('❌ Failed to update product images:', error.message);
    process.exit(1);
  }
}

updateProductImages().then(() => {
  process.exit(0);
});

