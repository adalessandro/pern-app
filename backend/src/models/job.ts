import { Table, Model, Column, DataType,  BelongsTo, ForeignKey } from 'sequelize-typescript';
import { User } from './user';

@Table({
    tableName: "jobs",
})
export class Job extends Model {
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        autoIncrementIdentity:true
    })
    id!: number;
    
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string;
    @BelongsTo(() => User)
    createdBy: User

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    createdById: number


}
