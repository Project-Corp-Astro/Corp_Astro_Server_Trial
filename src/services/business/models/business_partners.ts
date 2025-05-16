import {
  Model,
  DataTypes,
} from 'sequelize';
import sequelize from '../../../config/sequelize.config';

export interface BusinessPartnerAttributes {
  partner_id?: string;
  partner_name: string;
  role?: string;
  business_id?: string;
  user_id: string;           // Link to the user who added this partner
  date_of_birth?: string;
  birth_time?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  timezone_offset: number;    // ❗ made it non-optional (to match User)
  created_at?: Date;
  updated_at?: Date;
}

class BusinessPartner extends Model<BusinessPartnerAttributes> implements BusinessPartnerAttributes {
  public partner_id?: string;
  public partner_name!: string;
  public role?: string;
  public business_id?: string;
  public user_id!: string;   
  public date_of_birth?: string;
  public birth_time?: string;
  public location?: string;
  public latitude?: number;
  public longitude?: number;
  public timezone_offset!: number;
  public created_at?: Date;
  public updated_at?: Date;
}

BusinessPartner.init(
  {
      partner_id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: sequelize.fn('uuid_generate_v4'),
      },
      partner_name: {
          type: DataTypes.STRING(100),
          allowNull: false,
      },
      role: {
          type: DataTypes.STRING(50),
          allowNull: true,
      },
      business_id: {
        type: DataTypes.UUID,
        allowNull: true, // ✅ optional
        references: {
          model: 'business_profiles',
          key: 'business_id',
        },
        onDelete: 'CASCADE',
      },      
      user_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
              model: 'users',
              key: 'user_id',
          },
          onDelete: 'CASCADE',
      },
      date_of_birth: {
          type: DataTypes.DATEONLY,    
          allowNull: true,
      },
      birth_time: {
          type: DataTypes.TIME,         // 👈 matched User type
          allowNull: true,
      },
      location: {
          type: DataTypes.STRING(255),  // 👈 matched User.place_of_birth
          allowNull: true,
      },
      latitude: {
        type: DataTypes.DECIMAL(10, 6),  // 👈 matched User
        allowNull: true
      },
      longitude: {
        type: DataTypes.DECIMAL(10, 6),  // 👈 matched User
        allowNull: true
      },
      timezone_offset: {
        type: DataTypes.FLOAT, // Make sure to use a number type (FLOAT or INTEGER)
        allowNull: false,
      },
      created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
  },
  {
      sequelize,
      tableName: 'business_partners',
      timestamps: false,
  }
);

export default BusinessPartner;
