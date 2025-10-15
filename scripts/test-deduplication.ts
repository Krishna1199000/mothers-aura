#!/usr/bin/env tsx

/**
 * Test script for Cranberri Diamond Deduplication Logic
 * 
 * This script tests the new deduplication logic to ensure it properly
 * handles diamonds with the same stockId but different properties.
 */

import { fetchAllDiamonds } from '../lib/api/cranberri-diamonds';

function testDeduplicationLogic(diamonds: any[]) {
  console.log('\n🧪 TESTING DEDUPLICATION LOGIC\n');
  
  // Create unique key function (same as in sync batch)
  const createUniqueKey = (diamond: any) => {
    return `${diamond.stockId}-${diamond.size}-${diamond.color}-${diamond.clarity}-${diamond.shape}-${diamond.lab}`;
  };

  // Test 1: StockId-only analysis (old logic)
  const stockIds = diamonds.map(d => d.stockId);
  const uniqueStockIds = [...new Set(stockIds)];
  const stockIdDuplicates = stockIds.length - uniqueStockIds.length;
  
  console.log('📋 Test 1: StockId-only deduplication (OLD LOGIC):');
  console.log(`   Total diamonds: ${diamonds.length}`);
  console.log(`   Unique stockIds: ${uniqueStockIds.length}`);
  console.log(`   Would remove: ${stockIdDuplicates} diamonds`);
  
  // Test 2: Composite key analysis (new logic)
  const uniqueKeys = diamonds.map(createUniqueKey);
  const uniqueKeySet = [...new Set(uniqueKeys)];
  const actualDuplicates = uniqueKeys.length - uniqueKeySet.length;
  
  console.log('\n🔑 Test 2: Composite key deduplication (NEW LOGIC):');
  console.log(`   Total diamonds: ${diamonds.length}`);
  console.log(`   Unique combinations: ${uniqueKeySet.length}`);
  console.log(`   Actual duplicates: ${actualDuplicates}`);
  console.log(`   Would keep: ${uniqueKeySet.length} diamonds`);
  
  // Test 3: Find diamonds with same stockId but different properties
  const duplicateStockIds = uniqueStockIds.filter(id => 
    stockIds.filter(sid => sid === id).length > 1
  );
  
  console.log('\n🔍 Test 3: Analysis of diamonds with same stockId:');
  console.log(`   StockIds with multiple entries: ${duplicateStockIds.length}`);
  
  if (duplicateStockIds.length > 0) {
    console.log('\n📋 Examples of diamonds with same stockId but different properties:');
    
    duplicateStockIds.slice(0, 5).forEach((stockId, index) => {
      const diamondsWithSameId = diamonds.filter(d => d.stockId === stockId);
      console.log(`\n   ${index + 1}. StockId: "${stockId}" (${diamondsWithSameId.length} entries):`);
      
      diamondsWithSameId.forEach((diamond, idx) => {
        const uniqueKey = createUniqueKey(diamond);
        console.log(`      ${idx + 1}. Key: ${uniqueKey}`);
        console.log(`         Size: ${diamond.size}, Color: ${diamond.color}, Clarity: ${diamond.clarity}`);
        console.log(`         Shape: ${diamond.shape}, Lab: ${diamond.lab}`);
      });
    });
  }
  
  // Test 4: Simulate the new deduplication logic
  console.log('\n⚙️  Test 4: Simulating new deduplication logic:');
  
  const deduplicatedDiamonds = diamonds.reduce((acc, diamond) => {
    const uniqueKey = createUniqueKey(diamond);
  const existing = acc.find((d: any) => createUniqueKey(d) === uniqueKey);
    
    if (!existing) {
      acc.push(diamond);
    } else {
      // Keep the one with the latest createdAt
      const existingCreatedAt = new Date(existing.createdAt || 0);
      const currentCreatedAt = new Date(diamond.createdAt || 0);
      
      if (currentCreatedAt > existingCreatedAt) {
        const index = acc.findIndex((d: any) => createUniqueKey(d) === uniqueKey);
        acc[index] = diamond;
      }
    }
    return acc;
  }, [] as typeof diamonds);
  
  console.log(`   Input diamonds: ${diamonds.length}`);
  console.log(`   Output diamonds: ${deduplicatedDiamonds.length}`);
  console.log(`   Removed duplicates: ${diamonds.length - deduplicatedDiamonds.length}`);
  
  // Summary
  console.log('\n📊 SUMMARY:');
  console.log(`   Old logic would keep: ${uniqueStockIds.length} diamonds`);
  console.log(`   New logic will keep: ${deduplicatedDiamonds.length} diamonds`);
  console.log(`   Improvement: +${deduplicatedDiamonds.length - uniqueStockIds.length} diamonds`);
  
  return {
    oldLogicCount: uniqueStockIds.length,
    newLogicCount: deduplicatedDiamonds.length,
    improvement: deduplicatedDiamonds.length - uniqueStockIds.length,
    actualDuplicates,
    duplicateStockIds: duplicateStockIds.length
  };
}

async function main() {
  try {
    console.log('🚀 Testing Cranberri Diamond Deduplication Logic\n');
    
    // Fetch all diamonds
    console.log('📥 Fetching diamonds from API...');
    const diamonds = await fetchAllDiamonds();
    console.log(`✅ Fetched ${diamonds.length} diamonds\n`);
    
    // Test the deduplication logic
    const results = testDeduplicationLogic(diamonds);
    
    console.log('\n🎯 CONCLUSION:');
    if (results.improvement > 0) {
      console.log(`✅ The new deduplication logic will preserve ${results.improvement} additional unique diamonds!`);
      console.log(`   This means you'll get ${results.newLogicCount} diamonds instead of ${results.oldLogicCount}`);
    } else if (results.improvement === 0) {
      console.log(`✅ The new logic maintains the same count but with better accuracy`);
    } else {
      console.log(`⚠️  Unexpected: New logic would keep fewer diamonds`);
    }
    
    console.log(`\n📈 Expected sync results:`);
    console.log(`   - Total fetched: ${diamonds.length}`);
    console.log(`   - Unique diamonds: ${results.newLogicCount}`);
    console.log(`   - Database entries: ${results.newLogicCount}`);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
main().catch(console.error);


