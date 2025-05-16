import mongoose, { Schema, Document } from 'mongoose';

// Define the schema for storing Dasha data
const dashaSchema = new Schema(
  {
    user_id: { type: String, required: true ,ref:'User'}, // UUID or identifier for the natal chart
    system_type: {
      type: String,
      required: true,
      enum: ['VIMSHOTTARI', 'ASHTOTTARI', 'OTHER_SYSTEMS'],
      default: 'VIMSHOTTARI',
    },
    mahadashas: [
      {
        planet: { type: String, required: true },
        start_date: { type: Date, required: true },
        end_date: { type: Date, required: true },
        duration_years: { type: Number }, // Store duration for quick access
        antardashas: [
          {
            planet: { type: String, required: true },
            start_date: { type: Date, required: true },
            end_date: { type: Date, required: true },
            duration_years: { type: Number },
            pratyantardashas: [
              {
                planet: { type: String, required: true },
                start_date: { type: Date, required: true },
                end_date: { type: Date, required: true },
                sookshma_dashas: [
                  {
                    planet: { type: String, required: true },
                    start_date: { type: Date, required: true },
                    end_date: { type: Date, required: true },
                    duration_days: { type: Number }, // Duration in days for Sookshma Dasha
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

// Create and export the model
const DashaModel = mongoose.model('DashaChart', dashaSchema);
export default DashaModel;
