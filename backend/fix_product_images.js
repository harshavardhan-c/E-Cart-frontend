import { supabase } from './config/supabaseClient.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// Proper image mappings based on product descriptions
const productImageMap = {
  // Snacks
  'lays classic': '/placeholder.svg',
  'maggie 2-minute noodles': '/placeholder.svg',
  'roasted chickpeas': '/placeholder.svg',
  'organic granola': '/placeholder.svg',
  'cashew nuts': '/placeholder.svg',
  'mixed dry fruits': '/placeholder.svg',
  
  // Chocolates
  'dairy milk': '/chocolate-placeholder.svg',
  'perk': '/chocolate-placeholder.svg',
  'dark chocolate bar': '/chocolate-placeholder.svg',
  'milk chocolate truffles': '/chocolate-placeholder.svg',
  'assorted chocolates box': '/chocolate-placeholder.svg',
  'white chocolate bar': '/chocolate-placeholder.svg',
  
  // Utensils (kitchen items)
  'pressure cooker': '/pressure-cooker-stainless-steel.jpg',
  'kettle': '/placeholder.svg',
  'non-stick frying pan': '/non-stick-frying-pan.jpg',
  'mixing bowls set': '/mixing-bowls-stainless-steel-set.jpg',
  'kitchen knife set': '/kitchen-knife-set-professional.jpg',
  'stainless steel utensil set': '/stainless-steel-utensil-set.jpg',
  
  // Cosmetics
  'lipstick': '/cosmetics-placeholder.svg',
  'face cream': '/cosmetics-placeholder.svg',
  'shampoo': '/cosmetics-placeholder.svg',
  'body lotion': '/cosmetics-placeholder.svg',
  
  // Dry Fruits
  'almonds': '/placeholder.svg',
  'cashews': '/placeholder.svg',
  'raisins': '/placeholder.svg',
  'dates': '/placeholder.svg',
  'pistachios': '/placeholder.svg',
  
  // Plastic Items
  'dustbin': '/trash-bin-with-lid.jpg',
  'water bottle': '/steel-water-bottle-insulated.jpg',
  'storage containers set': '/products/storage-containers.jpg',
  'lunch box set': '/placeholder.svg',
  
  // Appliances
  'mixer grinder': '/placeholder.svg',
  'electric oven': '/placeholder.svg',
  'rice cooker': '/placeholder.svg',
  'toaster': '/placeholder.svg',
};

async function fixProductImages() {
  console.log('🔧 Fixing product images to match product names...\n');
  
  try {
    const categories = ['snacks', 'chocolates', 'utensils', 'cosmetics', 'dry_fruits', 'plastic_items', 'appliances'];
    
    for (const category of categories) {
      console.log(`📦 Processing ${category}...`);
      
      const { data: products, error: fetchError } = await supabase
        .from(category)
        .select('*');
      
      if (fetchError) {
        console.error(`   ❌ Error fetching ${category}:`, fetchError.message);
        continue;
      }
      
      if (!products || products.length === 0) {
        console.log(`   ⚠️  No products found in ${category}`);
        continue;
      }
      
      for (const product of products) {
        const productName = product.name.toLowerCase();
        let imageUrl = '/placeholder.svg'; // default
        
        // Find matching image
        for (const [key, image] of Object.entries(productImageMap)) {
          if (productName.includes(key)) {
            imageUrl = image;
            break;
          }
        }
        
        const { error: updateError } = await supabase
          .from(category)
          .update({ image_url: imageUrl })
          .eq('id', product.id);
        
        if (updateError) {
          console.error(`   ❌ Error updating ${product.name}:`, updateError.message);
        } else {
          console.log(`   ✅ ${product.name} → ${imageUrl}`);
        }
      }
      
      console.log('');
    }
    
    console.log('🎉 Product images fixed successfully!');
  } catch (error) {
    console.error('❌ Failed to fix product images:', error.message);
    process.exit(1);
  }
}

fixProductImages().then(() => {
  process.exit(0);
});







