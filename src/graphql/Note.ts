import { extendType, intArg, nonNull, objectType, stringArg} from "nexus";
import { Note } from "../entities/Note";
import { Context } from "src/types/Context";
import { UpdateResult, FindOneOptions } from "typeorm";

export const NoteType = objectType({
  name: 'Note',           
  definition(t) {
    t.int('id'),          
    t.string('title'),   
    t.string('body'),
    t.string('createdAt')
  },
});

// let notes: NexusGenObjects["Note"][] = [
//     {
//         id: 1,
//         title: 'Catatan 1',
//         body: 'Ini adalah catatan 1'
//     }
// ];
export const NotesQuery = extendType({
    type: "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("notes", {
            type: "Note",
            resolve(_parent, _args, context: Context, _info): Promise<Note[]> {
                // return Note.find();
                const { conn } = context;
                return conn.query(`SELECT * FROM Note`);
            },
        });
    },
});
export const CreateNoteMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("createNote", {
            type: "Note",
            args: {
                title: nonNull(stringArg()),
                body: nonNull(stringArg())
            },
            resolve(_parent, args, _context, _info): Promise<Note>{
                const { title, body } = args;
                return Note.create({ title, body }).save();
            },
        });
    },
});
export const DeleteNoteMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("deleteNote", {
            type: "Note",
            args: {
                id: nonNull(intArg()),
            },
            resolve(_parent, args, _context, _info): Promise<Note | null> {
                const { id } = args;
                return Note.delete({ id }).then((deleteResult) => {
                    if (deleteResult.affected && deleteResult.affected > 0) {
                        const findOneOptions: FindOneOptions<Note> = {
                            where: { id },
                        };
                        return Note.findOne(findOneOptions);
                    } else {
                        return null;
                    }
                });
            },
        });
    },
});

export const GetDetailNoteQuery = extendType({
    type: "Query",
    definition(t) {
        t.field("getDetailNote", {
            type: "Note",
            args: {
                id: nonNull(intArg()),
            },
            resolve(_parent, args, _context, _info): Promise<Note | null> {
                const { id } = args;
                return Note.findOne({ where: { id } });
            },
        });
    },
});

export const EditNoteMutation = extendType({
    type: "Mutation",
    definition(t) {
        t.nonNull.field("editNote", {
            type: "Note",
            args: {
                id: nonNull(intArg()),
                title: stringArg(),
                body: stringArg(),
            },
            resolve(_parent, args, _context, _info): Promise<Note | null> {
                const { id, title, body } = args;
                return Note.update({ id }, { title, body }).then(
                    (updateResult: UpdateResult) => {
                        if (updateResult.affected && updateResult.affected > 0) {
                            const findOneOptions: FindOneOptions<Note> = {
                                where: { id },
                            };
                            return Note.findOne(findOneOptions);
                        } else {
                            return null;
                        }
                    }
                );
            },
        });
    },
});