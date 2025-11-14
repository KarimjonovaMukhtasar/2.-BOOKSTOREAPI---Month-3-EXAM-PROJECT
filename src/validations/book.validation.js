import {z} from "zod"

const bookValidate = z.object({
    title: z.string().trim().min(1, `BOOK TITLE CAN'T BE EMPTY`),
    author_id: z.uuid().trim(),
    genre_id: z.uuid().trim(),
    price: z.decimal().positive(), 
    stock: z.number().positive(),
    published_date: z.date().trim(),
    status: z.enum(['available', 'out of stock', 'discontinued']),
    imageUrls: z.array(),
    description: z.string().min(10, 'TOO SHORT FOR A DESCRIPTION').optional()
})


const bookUpdate = z.object({
    title: z.string().trim().min(1, `BOOK TITLE CAN'T BE EMPTY`).optional(),
    author_id: z.uuid().trim().optional(),
    genre_id: z.uuid().trim().optional(),
    price: z.decimal().positive().optional(), 
    stock: z.number().positive().optional(),
    published_date: z.date().trim().optional(),
    status: z.enum(['available', 'out of stock', 'discontinued']).optional(),
    imageUrls: z.array(z.string().url("Each item in the array must be a valid URL.")).min(1, "The image URLs array cannot be empty."),
    description: z.string().min(10, 'TOO SHORT FOR A DESCRIPTION').optional()
})

export {bookValidate, bookUpdate}