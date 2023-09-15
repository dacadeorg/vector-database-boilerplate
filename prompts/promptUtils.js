// file: /prompts/promptUtils.js
export function getSystemPrompt() {
  return {
    role: "system",
    content: "You are a helpful assistant that specializes in generating creative pet names.",
  };
}

export function getUserPrompt(input) {
  return {
    role: "user",
    content: `Generate a creative pet name and short description for a ${input}.`,
  };
}

export function getFunctions() {
  return [
    {
      name: "generate_pet_name",
      description: "Generate a pet name for an animal.",
      parameters: {
        type: "object",
        properties: {
          animalPetName: {
            type: "string",
            description: "The generated pet name for the animal",
          },
          description: {
            type: "string",
            description: "The generated explanation of the pet name",
          },
        },
        "required": ["animalPetName", "description"]
      },
    },
  ];
}