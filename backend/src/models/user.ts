import { Table, Model, Column, DataType } from 'sequelize-typescript';


@Table({
    tableName: "users",
})
export class User extends Model {
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
        unique: true
    })
    username!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    fullname!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    email!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    role!: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    active!: string;
}
