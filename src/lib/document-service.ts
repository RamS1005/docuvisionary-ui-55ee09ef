import { DocumentFile, ProcessingResult, FeatureType } from './types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Google Vision API for demonstration purposes
// In a real app, you would use the @google-cloud/vision client properly
const processWithGoogleVision = async (file: File, feature: FeatureType): Promise<ProcessingResult> => {
  console.log(`Processing ${file.name} with Google Vision API (${feature} mode)`);
  
  // Simulate API call delay
  await delay(1500);
  
  if (feature === 'ocr') {
    return {
      text: "The Google Vision API has extracted this text from your document. This appears to be a financial report for Q3 2023, containing revenue figures, expense breakdowns, and projections for the upcoming fiscal year.",
      entities: [
        { text: "Revenue: $5.2M", type: "financial", confidence: 0.97 },
        { text: "Q3 2023", type: "date", confidence: 0.99 },
        { text: "Expense Ratio: 0.31", type: "metric", confidence: 0.95 },
        { text: "Growth Projection: 12%", type: "forecast", confidence: 0.88 }
      ],
      confidence: 0.94,
      source: "google-vision"
    };
  } else {
    return {
      text: "The Google Vision API has analyzed the visual elements in your document. The document contains multiple charts, graphs, and a company logo in the header.",
      entities: [
        { text: "Bar Chart - Revenue Growth", type: "chart", confidence: 0.92 },
        { text: "Company Logo", type: "logo", confidence: 0.97 },
        { text: "Signature - CFO", type: "signature", confidence: 0.86 },
        { text: "Product Image", type: "image", confidence: 0.94 }
      ],
      summary: "Financial report with 3 data visualizations, company branding, and signed authorization from the CFO.",
      confidence: 0.91,
      source: "google-vision"
    };
  }
};

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
  
  // Process with Google Vision API (mock)
  try {
    const processingResult = await processWithGoogleVision(file, feature);
    document.processed = true;
    document.processingResult = processingResult;
  } catch (error) {
    console.error("Error with Google Vision processing:", error);
    document.processed = true;
    document.processingResult = {
      text: "Error processing document with Google Vision API.",
      confidence: 0,
      error: "Processing failed",
      source: "error"
    };
  }
  
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

// New function to generate AI responses to document queries
export const generateDocumentResponse = async (
  message: string,
  document: DocumentFile | null
): Promise<string> => {
  if (!document || !document.processingResult) {
    return "I don't have any document to analyze. Please upload a document first.";
  }
  
  console.log(`Generating response about document: ${document.name} for query: ${message}`);
  
  // Simulate AI thinking time
  await delay(1000);
  
  // Document content-aware responses
  const docContent = document.processingResult.text || "";
  const docSummary = document.processingResult.summary || "";
  const entities = document.processingResult.entities || [];
  
  // Query categorization (very simple for demo)
  if (message.toLowerCase().includes("summary") || message.toLowerCase().includes("about")) {
    return `Based on my analysis, this document appears to be ${docSummary || "a business document with various sections and data points"}. ${
      docContent.substring(0, 120)}...`;
  }
  
  if (message.toLowerCase().includes("entities") || message.toLowerCase().includes("extract") || 
      message.toLowerCase().includes("information") || message.toLowerCase().includes("data")) {
    const entityList = entities.map(e => `- ${e.text} (${e.type}, ${Math.round(e.confidence * 100)}% confidence)`).join("\n");
    return `I've extracted the following key information from the document:\n\n${entityList}`;
  }
  
  if (message.toLowerCase().includes("confidence") || message.toLowerCase().includes("accuracy")) {
    return `My overall confidence in the analysis of this document is ${Math.round((document.processingResult.confidence || 0) * 100)}%. ${
      document.processingResult.source === "google-vision" ? 
      "This analysis was performed using Google's Vision AI." : 
      "The document was analyzed using our standard processing engine."}`;
  }
  
  // Default response with document awareness
  return `Based on the ${document.name} document you've uploaded, I can see it contains information about ${
    entities.length > 0 ? entities[0].text : "various business topics"}. 
    ${docContent.substring(0, 100)}... 
    
    Is there anything specific you'd like to know about this document?`;
};
