
import { DocumentFile, ProcessingResult, FeatureType } from './types';

// This is a mock service for demonstration purposes
// In a real app, this would connect to your backend API

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const processDocument = async (
  file: File, 
  feature: FeatureType
): Promise<DocumentFile> => {
  // Generate a unique ID for the file
  const id = Math.random().toString(36).substring(2, 15);
  
  // Create object URL for the file preview
  const url = URL.createObjectURL(file);
  
  // Create a document object
  const document: DocumentFile = {
    id,
    name: file.name,
    type: file.type,
    size: file.size,
    url,
    uploadedAt: new Date(),
    processed: false,
  };
  
  // Simulate processing delay
  await delay(2000);
  
  // Generate mock processing result based on feature type
  const processingResult: ProcessingResult = feature === 'ocr' 
    ? generateOcrResult() 
    : generateVisionResult();
  
  // Update the document with processing results
  document.processed = true;
  document.processingResult = processingResult;
  
  return document;
};

const generateOcrResult = (): ProcessingResult => {
  return {
    text: "This is a sample document text extracted using OCR. The system has identified key information including invoice details, dates, and amounts.",
    entities: [
      { text: "Invoice #12345", type: "invoice_number", confidence: 0.95 },
      { text: "01/15/2023", type: "date", confidence: 0.92 },
      { text: "$1,250.00", type: "amount", confidence: 0.97 }
    ],
    confidence: 0.94
  };
};

const generateVisionResult = (): ProcessingResult => {
  return {
    text: "The document contains an image of a business contract with signatures and a company logo.",
    entities: [
      { text: "Company Logo", type: "logo", confidence: 0.88 },
      { text: "Signature", type: "signature", confidence: 0.85 },
      { text: "Contract Title", type: "title", confidence: 0.93 }
    ],
    summary: "Business contract document with official signatures and company branding elements.",
    confidence: 0.89
  };
};

export const getFilePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      // For non-image files, return a generic preview
      resolve('/placeholder.svg');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to generate preview'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};
