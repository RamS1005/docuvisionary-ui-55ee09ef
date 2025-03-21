
import { DocumentFile, FeatureType, ProcessingResult, Entity } from './types';
import { ImageAnnotatorClient } from '@google-cloud/vision';

// Determine if we can use Google Vision API or if we should use mock data
const useRealGoogleVision = import.meta.env.VITE_USE_REAL_GOOGLE_VISION === 'true';
console.log('Using real Google Vision API:', useRealGoogleVision);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Function to initialize Google Vision client
const initializeVisionClient = () => {
  try {
    // Check if API key is set
    const apiKey = import.meta.env.VITE_GOOGLE_VISION_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
      console.warn('Google Vision API key not set properly in .env file');
      return null;
    }
    
    // Set API key in credentials
    const credentials = {
      client_email: 'document-ai@example.com', // This would be from your Google Cloud service account
      private_key: apiKey,
    };
    
    // Configure the client with API key
    return new ImageAnnotatorClient({ credentials });
  } catch (error) {
    console.error("Failed to initialize Google Vision client:", error);
    return null;
  }
};

// Process document with Google Vision API
const processWithGoogleVision = async (file: File) => {
  try {
    console.log("Attempting to process with Google Vision API");
    const visionClient = initializeVisionClient();
    
    if (!visionClient) {
      console.warn("Google Vision client not initialized - using mock data instead");
      return processMockDocument(file);
    }
    
    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    const content = Buffer.from(buffer);
    
    // Process with Google Vision API
    const [result] = await visionClient.documentTextDetection(content);
    const fullText = result.fullTextAnnotation?.text || '';
    
    // Extract entities (this would require more complex processing in a real app)
    const entities: Entity[] = [];
    
    // Create processing result
    const processingResult: ProcessingResult = {
      text: fullText,
      entities,
      confidence: 0.95,
      summary: `Document contains ${fullText.length} characters of text.`,
    };
    
    return processingResult;
  } catch (error) {
    console.error("Error processing with Google Vision:", error);
    console.log("Falling back to mock processing");
    return processMockDocument(file);
  }
};

// Process document with mock data for testing/development
const processMockDocument = async (file: File) => {
  // Simulate processing delay (1-2 seconds)
  await delay(1000 + Math.random() * 1000);
  
  // Create mock processing result
  const mockText = "This is a sample document containing important information. The document appears to be a business letter or invoice with various sections including contact details, pricing information, and terms of service.";
  
  const mockEntities: Entity[] = [
    { type: 'PERSON', text: 'John Smith', confidence: 0.92 },
    { type: 'ORGANIZATION', text: 'Acme Corporation', confidence: 0.89 },
    { type: 'DATE', text: 'January 15, 2023', confidence: 0.95 },
    { type: 'AMOUNT', text: '$1,250.00', confidence: 0.97 },
  ];
  
  const processingResult: ProcessingResult = {
    text: mockText,
    entities: mockEntities,
    confidence: 0.93,
    summary: "This document appears to be a business invoice from Acme Corporation to John Smith dated January 15, 2023 for $1,250.00.",
  };
  
  return processingResult;
};

// Get preview of uploaded file
export const getFilePreview = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    try {
      if (file.type.startsWith('image/')) {
        // For image files, create a data URL
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            resolve(e.target.result as string);
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        // For PDFs, return a placeholder PDF icon
        resolve('/placeholder.svg');
      } else {
        // For other file types, return a generic document icon
        resolve('/placeholder.svg');
      }
    } catch (error) {
      console.error('Error creating file preview:', error);
      reject(error);
    }
  });
};

// Process document based on selected feature
export const processDocument = async (file: File, feature: FeatureType): Promise<DocumentFile> => {
  try {
    console.log(`Processing document with feature: ${feature}`);
    
    // Create preview URL
    const previewUrl = await getFilePreview(file);
    
    // Process document based on feature type
    const processingResult = useRealGoogleVision 
      ? await processWithGoogleVision(file)
      : await processMockDocument(file);
    
    // Create document object
    const documentFile: DocumentFile = {
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
      preview: previewUrl,
      uploadDate: new Date(),
      processed: true,
      processingResult,
    };
    
    return documentFile;
  } catch (error) {
    console.error('Error processing document:', error);
    throw error;
  }
};

// Generate response for chat based on document content
export const generateDocumentResponse = async (
  query: string,
  document: DocumentFile | null
): Promise<string> => {
  // Simulate AI processing delay
  await delay(1000 + Math.random() * 1000);
  
  if (!document || !document.processed || !document.processingResult) {
    return "I'm sorry, I don't have a processed document to analyze. Please upload and process a document first.";
  }
  
  const { text, entities, summary } = document.processingResult;
  
  // Simple keyword matching (in a real app, this would use a proper NLP/LLM)
  const lowercaseQuery = query.toLowerCase();
  
  if (lowercaseQuery.includes('summary') || lowercaseQuery.includes('summarize')) {
    return summary;
  }
  
  if (lowercaseQuery.includes('entities') || lowercaseQuery.includes('people') || lowercaseQuery.includes('names')) {
    if (entities.length === 0) {
      return "I didn't detect any named entities in this document.";
    }
    
    return `I found these entities in the document:\n\n${entities
      .map(e => `- ${e.text} (${e.type}, ${Math.round(e.confidence * 100)}% confidence)`)
      .join('\n')}`;
  }
  
  if (lowercaseQuery.includes('content') || lowercaseQuery.includes('text')) {
    return `Here's the text content of the document:\n\n${text}`;
  }
  
  // Default response
  return `I've analyzed the document "${document.name}". It contains ${text.length} characters of text and ${entities.length} recognized entities. ${summary} What specific information would you like to know about it?`;
};
