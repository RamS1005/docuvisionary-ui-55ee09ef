
import { DocumentFile, ProcessingResult, FeatureType } from './types';
import { ImageAnnotatorClient } from '@google-cloud/vision';

// Determine if we can use Google Vision API or if we should use mock data
const useRealGoogleVision = false; // Set to true when API key is configured

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to initialize Google Vision client
const initializeVisionClient = () => {
  try {
    // This requires proper API key configuration
    return new ImageAnnotatorClient();
  } catch (error) {
    console.error("Failed to initialize Google Vision client:", error);
    return null;
  }
};

// Process document with actual Google Vision API
const processWithRealGoogleVision = async (file: File, feature: FeatureType): Promise<ProcessingResult> => {
  console.log(`Processing ${file.name} with actual Google Vision API (${feature} mode)`);
  
  try {
    const visionClient = initializeVisionClient();
    
    if (!visionClient) {
      throw new Error("Google Vision client not initialized");
    }
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Determine which features to request based on feature type
    if (feature === 'ocr') {
      const [result] = await visionClient.textDetection(buffer);
      const detections = result.textAnnotations || [];
      const fullText = detections.length > 0 ? detections[0].description : "";
      
      // Extract potential entities
      const entities = [];
      if (detections.length > 1) {
        for (let i = 1; i < Math.min(10, detections.length); i++) {
          if (detections[i].description) {
            entities.push({
              text: detections[i].description,
              type: 'text',
              confidence: detections[i].confidence || 0.8
            });
          }
        }
      }
      
      return {
        text: fullText,
        entities,
        confidence: 0.9,
        source: "google-vision-api"
      };
    } else {
      // Vision mode - analyze image properties, labels, etc.
      const [labelResults] = await visionClient.labelDetection(buffer);
      const labels = labelResults.labelAnnotations || [];
      
      const entities = labels.map(label => ({
        text: label.description || 'Unknown',
        type: 'label',
        confidence: label.score || 0.7
      }));
      
      return {
        text: "Visual analysis complete. Here's what I found in your document:",
        entities,
        summary: `Document contains ${entities.length} identified elements.`,
        confidence: 0.85,
        source: "google-vision-api"
      };
    }
  } catch (error) {
    console.error("Error with real Google Vision processing:", error);
    throw error;
  }
};

// Mock Google Vision API for demonstration purposes
const processWithMockGoogleVision = async (file: File, feature: FeatureType): Promise<ProcessingResult> => {
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
      source: "google-vision-mock"
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
      source: "google-vision-mock"
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
  
  // Create a preview for the document
  let preview = null;
  try {
    preview = await getFilePreview(file);
  } catch (error) {
    console.error("Failed to generate preview:", error);
  }
  
  // Create a document object
  const document: DocumentFile = {
    id,
    name: file.name,
    type: file.type,
    size: file.size,
    url,
    preview,
    uploadedAt: new Date(),
    processed: false,
  };
  
  // Process with Google Vision API
  try {
    const processingResult = useRealGoogleVision 
      ? await processWithRealGoogleVision(file, feature)
      : await processWithMockGoogleVision(file, feature);
      
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

export const getFilePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Check if file is PDF
    if (file.type === 'application/pdf') {
      // For PDF files, we would normally generate a thumbnail
      // For now, return a placeholder
      resolve('/placeholder.svg');
      return;
    }
    
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

// Enhanced AI response generation with more document awareness
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
  const source = document.processingResult.source || "unknown";
  
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
      source.includes("google-vision") ? 
      "This analysis was performed using Google's Vision AI." : 
      "The document was analyzed using our standard processing engine."}`;
  }
  
  if (message.toLowerCase().includes("list") && 
      (message.toLowerCase().includes("object") || message.toLowerCase().includes("price"))) {
    const priceRelatedEntities = entities.filter(e => 
      e.text.includes("$") || 
      e.text.toLowerCase().includes("price") || 
      e.text.toLowerCase().includes("cost") ||
      e.type.toLowerCase().includes("price") ||
      e.type.toLowerCase().includes("financial")
    );
    
    if (priceRelatedEntities.length > 0) {
      const priceList = priceRelatedEntities.map(e => `- ${e.text}`).join("\n");
      return `I found the following pricing information in your document:\n\n${priceList}`;
    } else {
      return `I couldn't find any specific pricing information in this document. Would you like me to list all the entities I detected instead?`;
    }
  }
  
  // Default response with document awareness
  return `Based on the ${document.name} document you've uploaded, I can see it contains information about ${
    entities.length > 0 ? entities[0].text : "various business topics"}. 
    ${docContent.substring(0, 100)}... 
    
    Is there anything specific you'd like to know about this document?`;
};
