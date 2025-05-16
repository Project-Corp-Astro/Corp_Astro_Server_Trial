import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

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

interface ABTestAssignmentCreationAttributes extends Optional<ABTestAssignmentAttributes, 'assignment_id' | 'converted' | 'converted_at' | 'created_at' | 'updated_at'> {}

class ABTestAssignment extends Model<ABTestAssignmentAttributes, ABTestAssignmentCreationAttributes> implements ABTestAssignmentAttributes {
  public assignment_id!: string;
  public test_id!: string;
  public user_id?: string;
  public session_id!: string;
  public variant!: string;
  public converted!: boolean;
  public assigned_at!: Date;
  public converted_at?: Date;
  public created_at!: Date;
  public updated_at!: Date;

  static initModel(sequelize: Sequelize): typeof ABTestAssignment {
    ABTestAssignment.init({
      assignment_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      test_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'ab_tests',
          key: 'test_id'
        }
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'user_id'
        }
      },
      session_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      variant: {
        type: DataTypes.STRING,
        allowNull: false
      },
      converted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      assigned_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      converted_at: {
        type: DataTypes.DATE,
        allowNull: true
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
      tableName: 'ab_test_assignments',
      timestamps: true,
      indexes: [
        { fields: ['test_id'] },
        { fields: ['user_id'] },
        { fields: ['session_id'] },
        { fields: ['variant'] },
        { fields: ['converted'] }
      ]
    });

    return ABTestAssignment;
  }

  static associate(models: any) {
    // Define associations here
    ABTestAssignment.belongsTo(models.ABTest, { foreignKey: 'test_id', as: 'test' });
    ABTestAssignment.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

export default ABTestAssignment;
