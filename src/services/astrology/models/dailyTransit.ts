import { Model, DataTypes } from 'sequelize';
import sequelize from '../../../config/sequelize.config';

export interface DailyTransitAttributes {
transit_id: number;
transit_timestamp: Date;
planet: string;
longitude: number;
latitude?: number;
speed?: number;
acceleration?: number;
is_retrograde: boolean;
is_station?: boolean;
station_type?: string;
zodiac_sign: string;
zodiac_degree: number;
degree_formatted?: string;
nakshatra?: string;
nakshatra_pada?: number;
ayanamsa?: string;
ayanamsa_value: number;
zodiac_system?: string;
created_at: Date;
updated_at: Date;
}

export class DailyTransit extends Model<DailyTransitAttributes> implements DailyTransitAttributes {
public transit_id!: number;
public transit_timestamp!: Date;
public planet!: string;
public longitude!: number;
public latitude?: number;
public speed?: number;
public acceleration?: number;
public is_retrograde!: boolean;
public is_station?: boolean;
public station_type?: string;
public zodiac_sign!: string;
public zodiac_degree!: number;
public degree_formatted?: string;
public nakshatra?: string;
public nakshatra_pada?: number;
public ayanamsa?: string;
public ayanamsa_value!: number;
public zodiac_system?: string;
public created_at!: Date;
public updated_at!: Date;
}

DailyTransit.init(
{
transit_id: {
type: DataTypes.BIGINT,
allowNull: false,
primaryKey: true
},
transit_timestamp: {
type: DataTypes.DATE,
allowNull: false,
primaryKey: true,
comment: 'Partitioning column for TimescaleDB hypertable'
},
planet: {
type: DataTypes.STRING(20),
allowNull: false
},
longitude: {
type: DataTypes.DECIMAL(10, 6),
allowNull: false
},
latitude: {
type: DataTypes.DECIMAL(10, 6),
allowNull: true
},
speed: {
type: DataTypes.DECIMAL(10, 6),
allowNull: true
},
    acceleration: {
type: DataTypes.DECIMAL(10, 6),
allowNull: true
},
is_retrograde: {
type: DataTypes.BOOLEAN,
allowNull: false
},
is_station: {
type: DataTypes.BOOLEAN,
allowNull: true,
defaultValue: false
},
station_type: {
type: DataTypes.STRING(10),
allowNull: true
},
zodiac_sign: {
type: DataTypes.STRING(20),
allowNull: false
},
zodiac_degree: {
type: DataTypes.DECIMAL(5, 2),
allowNull: false
},
degree_formatted: {
type: DataTypes.STRING(30),
allowNull: true
},
nakshatra: {
type: DataTypes.STRING(30),
allowNull: true
},
nakshatra_pada: {
type: DataTypes.INTEGER,
allowNull: true
},
ayanamsa: {
type: DataTypes.STRING(20),
allowNull: true,
defaultValue: 'LAHIRI'
},
ayanamsa_value: {
type: DataTypes.DECIMAL(10, 6),
allowNull: false
},
zodiac_system: {
type: DataTypes.STRING(20),
allowNull: true,
defaultValue: 'SIDEREAL'
},
created_at: {
type: DataTypes.DATE,
allowNull: false,
defaultValue: DataTypes.NOW
},
updated_at: {
type: DataTypes.DATE,
allowNull: true,
field: 'updated_at'
}
},
{
sequelize,
tableName: 'daily_transits',
timestamps: true,
createdAt: 'created_at',
updatedAt: 'updated_at',
indexes: [
{
name: 'daily_transits_pkey',
unique: true,
fields: ['transit_timestamp', 'transit_id']
}
]
}
);
export default DailyTransit;
