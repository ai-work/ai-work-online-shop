import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import { sql } from '@vercel/postgres';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { NewUser, User, users } from '@/db/schema';

import { eq, ne, gt, gte } from "drizzle-orm";

export async function POST(req: Request) {
    try {
        const { userId } = auth();
        if (!userId) return new NextResponse('Unauthorized', {status: 401});

        // work with body
        const body = await req.json();
        
        const db = drizzle(sql)
        
        const result: User[] = await db.select().from(users);

        // db.select().from(table).where(eq(table.column, 5));
        // SELECT * FROM table WHERE table.column = 5

        // db.select().from(table).where(eq(table.column1, table.column2));
        // SELECT * FROM table WHERE table.column1 = table.column2

        // export async function insertUser(user: NewUser): Promise<User> {
            // const user: NewUser;
            // return db.insert(users).values(user).returning();
        // }


        //const connectionString = process.env.DB_CONN_STR;
        //const client = postgres(connectionString);
        //const db = drizzle(client);
        //const allUsers = await db.select().from(users);

    } catch (error) {
        console.log('STORES: POST - error: ', error);
        return new NextResponse('Internal Server Error', {status: 500});
    }
}