import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

export interface DailyHoroscopeAttributes {
  horoscope_id: number;
  zodiac_sign: string;
  prediction_date: Date;
  prediction: string;
  lucky_number?: number;
  lucky_color?: string;
  mood?: string;
  status: 'draft' | 'published';
  created_at: Date;
  updated_at: Date;
}

export class DailyHoroscope extends Model<DailyHoroscopeAttributes> implements DailyHoroscopeAttributes {
  public horoscope_id!: number;
  public zodiac_sign!: string;
  public prediction_date!: Date;
  public prediction!: string;
  public lucky_number?: number;
  public lucky_color?: string;
  public mood?: string;
  public status!: 'draft' | 'published';
  public created_at!: Date;
  public updated_at!: Date;
}

DailyHoroscope.init(
  {
    horoscope_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    zodiac_sign: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    prediction_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: 'Date for which the horoscope is applicable'
    },
    prediction: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    lucky_number: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lucky_color: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    mood: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'published'),
      allowNull: false,
      defaultValue: 'draft'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'daily_horoscopes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        name: 'unique_sign_date',
        unique: true,
        fields: ['zodiac_sign', 'prediction_date']
      }
    ]
  }
);

export default DailyHoroscope;
