import { convertFromDirectory } from "joi-to-typescript";

async function types(): Promise<void> {
  console.log("Running joi-to-typescript...");

  // Configure your settings here
  const result = await convertFromDirectory({
    schemaDirectory: "./src/dal/validations",
    typeOutputDirectory: "./src/dal/interfaces",
    debug: true,
  });

  if (result) {
    console.log("Completed joi-to-typescript");
  } else {
    console.log("Failed to run joi-to-typescrip");
  }
}

types();
