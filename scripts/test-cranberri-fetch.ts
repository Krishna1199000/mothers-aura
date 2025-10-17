#!/usr/bin/env tsx

/**
 * Test script for Cranberri Diamond Fetch
 * 
 * This script demonstrates how to use the fetchAllDiamonds function
 * to get all diamonds from the Cranberri API.
 */

import { fetchAllDiamonds, fetchAllDiamondsAggressive, exampleUsage } from '../lib/api/cranberri-diamonds';

async function main() {
  console.log('🚀 Testing Cranberri Diamond Fetch Functions\n');

  try {
    // Test 1: Standard fetch
    console.log('='.repeat(60));
    console.log('📋 TEST 1: Standard Fetch');
    console.log('='.repeat(60));
    
    const standardDiamonds = await fetchAllDiamonds();
    console.log(`\n✅ Standard fetch completed: ${standardDiamonds.length} diamonds\n`);

    // Test 2: Aggressive fetch
    console.log('='.repeat(60));
    console.log('📋 TEST 2: Aggressive Fetch');
    console.log('='.repeat(60));
    
    const aggressiveDiamonds = await fetchAllDiamondsAggressive();
    console.log(`\n✅ Aggressive fetch completed: ${aggressiveDiamonds.length} diamonds\n`);

    // Test 3: Example usage
    console.log('='.repeat(60));
    console.log('📋 TEST 3: Example Usage');
    console.log('='.repeat(60));
    
    await exampleUsage();

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY');
    console.log('='.repeat(60));
    console.log(`Standard fetch: ${standardDiamonds.length} diamonds`);
    console.log(`Aggressive fetch: ${aggressiveDiamonds.length} diamonds`);
    console.log(`Difference: ${aggressiveDiamonds.length - standardDiamonds.length} diamonds`);
    
    // Show sample data structure
    if (standardDiamonds.length > 0) {
      console.log('\n📋 Sample diamond data structure:');
      const sample = standardDiamonds[0];
      console.log(JSON.stringify(sample, null, 2));
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
main().catch(console.error);







