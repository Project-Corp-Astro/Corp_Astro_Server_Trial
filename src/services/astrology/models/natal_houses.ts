import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

export interface NatalHouseAttributes {
  house_id: string;
  chart_id: string;
  house_number: number;
  sign: string;
  start_longitude: number;
  start_longitude_formatted?: string;
  created_at: Date;
}

export class NatalHouse extends Model<NatalHouseAttributes> implements NatalHouseAttributes {
  public house_id!: string;
  public chart_id!: string;
  public house_number!: number;
  public sign!: string;
  public start_longitude!: number;
  public start_longitude_formatted?: string;
  public created_at!: Date;
}

  NatalHouse.init(
    {
      house_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
      },
      chart_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'natal_charts',
          key: 'chart_id',
        }
      },
      house_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 12
        }
      },
      sign: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      start_longitude: {
        type: DataTypes.DECIMAL(10, 6),
        allowNull: false
      },
      start_longitude_formatted: {
        type: DataTypes.STRING(30),
        allowNull: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    },
    {
      sequelize,
      tableName: 'natal_houses',
      timestamps: true,
      updatedAt: false, // No updated_at column
      underscored: true
    }
  );
 
  export default NatalHouse;