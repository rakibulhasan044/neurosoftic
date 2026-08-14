import { prisma } from "../../lib/prisma";

export const BarcodeService = {
  generateBarcode: async (categoryId: string, variantCode: string) => {
    // 1. Get Category Prefix
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw new Error("Category not found");
    
    // Ensure prefix is exactly 2 digits
    let prefix = category.prefix || "00";
    if (prefix.length < 2) prefix = prefix.padStart(2, '0');
    if (prefix.length > 2) prefix = prefix.substring(0, 2);
    // Convert to number string if it contains letters, or just assume it's digits as per SRS
    if (!/^\d+$/.test(prefix)) {
      // Fallback if admin entered letters instead of digits
      prefix = "99";
    }

    // 2. Ensure variantCode is exactly 4 digits
    let vCode = variantCode || "0000";
    if (vCode.length < 4) vCode = vCode.padStart(4, '0');
    if (vCode.length > 4) vCode = vCode.substring(0, 4);

    const sequenceKey = `${prefix}${vCode}`;

    // 3. Increment Sequence Transactionally
    const sequence = await prisma.$transaction(async (tx) => {
      let seq = await tx.barcodeSequence.findUnique({ where: { prefix: sequenceKey } });
      if (!seq) {
        seq = await tx.barcodeSequence.create({
          data: { prefix: sequenceKey, lastValue: 1 }
        });
      } else {
        seq = await tx.barcodeSequence.update({
          where: { prefix: sequenceKey },
          data: { lastValue: seq.lastValue + 1 }
        });
      }
      return seq;
    });

    // 4. Format Serial to 4 digits
    const serialStr = sequence.lastValue.toString().padStart(4, '0');

    // 5. Calculate Check Digits (simple sum mod 100)
    const baseString = `${prefix}${vCode}${serialStr}`;
    let sum = 0;
    for (let i = 0; i < baseString.length; i++) {
      sum += parseInt(baseString[i], 10);
    }
    const checkDigits = (sum % 100).toString().padStart(2, '0');

    // 6. Final 12-digit barcode
    const finalBarcode = `${baseString}${checkDigits}`;
    
    return {
      barcode: finalBarcode,
      sku: `${prefix}-${vCode}-${serialStr}`
    };
  }
};
