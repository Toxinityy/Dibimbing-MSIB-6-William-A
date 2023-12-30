import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Note extends BaseEntity{
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title: string
    @Column()
    body: string
    @CreateDateColumn()
    createdAt: Date
}