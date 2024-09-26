// import mongoose from "mongoose";

// export async function initMongoose() {
//   mongoose.set('strictQuery', true);
//   if (mongoose.connection.readyState === 1) {
//     return mongoose.connection.asPromise();
//   }
//   return await mongoose.connect(process.env.MONGODB_URL);
// }
import mongoose from "mongoose";

export async function initMongoose() {
  mongoose.set('strictQuery', true);

  // Check if the connection is already established
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection.asPromise();
  }

  // Define the connection options
  const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,  // Ensure TLS/SSL is used
    tlsAllowInvalidCertificates: true,  // For debugging: bypass SSL certificate validation
    serverSelectionTimeoutMS: 5000,  // Timeout after 5 seconds if unable to connect
    connectTimeoutMS: 10000,  // Timeout after 10 seconds if the connection can't be established
  };

  try {
    // Attempt to connect to MongoDB using the provided connection string and options
    return await mongoose.connect(process.env.MONGODB_URL, connectionOptions);
  } catch (error) {
    // Handle any connection errors
    console.error("MongoDB connection error:", error);

    if (error.name === 'MongoNetworkError') {
      // Handle specific network-related errors
      console.error("Network error:", error.message);
      if (error.code === 'AtlasError') {
        // Handle Atlas-specific errors
        console.error("AtlasError:", error.codeName);
      }
    }

    // Re-throw the error to propagate it up the stack
    throw error;
  }
}
