import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

interface ABTestAttributes {
  test_id: string;
  test_name: string;
  description?: string;
  variants: Record<string, any>[];
  start_date: Date;
  end_date?: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface ABTestCreationAttributes extends Optional<ABTestAttributes, 'test_id' | 'description' | 'end_date' | 'is_active' | 'created_at' | 'updated_at'> {}

class ABTest extends Model<ABTestAttributes, ABTestCreationAttributes> implements ABTestAttributes {
  public test_id!: string;
  public test_name!: string;
  public description?: string;
  public variants!: Record<string, any>[];
  public start_date!: Date;
  public end_date?: Date;
  public is_active!: boolean;
  public created_at!: Date;
  public updated_at!: Date;

  // Associations
  public readonly assignments?: ABTestAssignment[];

  static initModel(sequelize: Sequelize): typeof ABTest {
    ABTest.init({
      test_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      test_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      variants: {
        type: DataTypes.JSONB,
        allowNull: false,
        comment: 'Array of variant configurations'
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    }, {
      sequelize,
      tableName: 'ab_tests',
      timestamps: true,
      indexes: [
        { fields: ['test_name'] },
        { fields: ['is_active'] }
      ]
    });

    return ABTest;
  }

  static associate(models: any) {
    // Define associations here
    ABTest.hasMany(models.ABTestAssignment, { foreignKey: 'test_id', as: 'assignments' });
  }
}

// Define ABTestAssignment here to avoid circular dependencies
interface ABTestAssignmentAttributes {
  assignment_id: string;
  test_id: string;
  user_id?: string;
  session_id: string;
  variant: string;
  converted: boolean;
  assigned_at: Date;
  converted_at?: Date;
  created_at: Date;
  updated_at: Date;
}

class ABTestAssignment extends Model<ABTestAssignmentAttributes> {}

export default ABTest;
