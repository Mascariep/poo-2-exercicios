import express, { Request, Response } from 'express'
import cors from 'cors'
import { TVideoDB } from './types'
//import { db } from './database/BaseDatabase'
import { Video } from './models/Video'
import { VideoDatabase } from './database/VideosDatabase'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
});

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
});

app.get("/videos", async (req: Request, res: Response) => {
    try {
        // const q = req.query.q // pesquisa

        // let videosDB //declarei a variavel

        // if (q) {
        //     const result: TVideoDB[] = await db("videos").where("name", "LIKE", `%${q}%`)
        //     videosDB = result
        // } else {
        //     const result: TVideoDB[] = await db("videos")
        //     videosDB = result
        // }

        const q = req.query.q as string | undefined

        const videoDatabase = new VideoDatabase()
        const videosDB = await videoDatabase.findVideos(q)

        const videos: Video[] = videosDB.map((videoDB)=>
            new Video(
                videoDB.id,
                videoDB.title,
                videoDB.duration,
                videoDB.upload_at
            )
        )

        res.status(200).send(videos)

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
});

app.post("/videos", async (req: Request, res: Response) => {
    try {
        const { id, title, duration } = req.body

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (typeof title !== "string") {
            res.status(400)
            throw new Error("'title' deve ser string")
        }

        if (typeof duration !== "string") {
            res.status(400)
            throw new Error("'duration' deve ser string")
        }

        const videoDatabase = new VideoDatabase()
        const videoDBExists = await videoDatabase.findVideoById(id)

        if (videoDBExists) {
            res.status(400)
            throw new Error("'id' já existe")
        }

        const newVideo = new Video ( 
            id,
            title,
            duration,
            new Date().toISOString()
            ) 
        
        const newVideoDB: TVideoDB ={

            id: newVideo.getId(),
            title: newVideo.getTitle(),
            duration: newVideo.getDuration(),
            upload_at: newVideo.getUploadAt()
        }

        await videoDatabase. insertVideo(newVideoDB)

        const response = {
            message: "Video adicionando com sucesso!",
            newVideo
        }
        //const [ videoDB ]: TVideoDB[] = await db("videos").where({ id })

        res.status(201).send(response)

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
});

app.put("/videos/:id", async (req: Request, res: Response) => {
    try {
        const idToEdit = req.params.id

        const newId = req.body.id
        const newTitle = req.body.title
        const newDuration = req.body.duration

        if (typeof idToEdit !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (typeof newTitle !== "string") {
            res.status(400)
            throw new Error("'title' deve ser string")
        }

        if (typeof newDuration !== "string") {
            res.status(400)
            throw new Error("'duration' deve ser string")
        }

const videoDatabase = new VideoDatabase()
        const video = await videoDatabase.findVideoById(idToEdit)

        if (!video) {
            res.status(404);
            throw new Error("Vídeo não encontrado")
        }

        const updatedVideo = {
            id: newId || video.id,
            title: newTitle || video.title,
            duration: newDuration || video.duration,
            upload_at: video.upload_at,
        }

        await videoDatabase.updateVideo(idToEdit, updatedVideo)

        res.status(200).send({
            message: "Vídeo atualizado com sucesso!",
        })

} catch (error) {
    console.log(error)

    if (req.statusCode === 200) {
        res.status(500)
    }

    if (error instanceof Error) {
        res.send(error.message)
    } else {
        res.send("Erro inesperado")
    }
}
});

app.delete("/videos/:id", async (req: Request, res: Response) =>{
    try {
        const idToDelete = req.params.id;

        if (typeof idToDelete !== "string") {
            res.status(400);
            throw new Error("'id' deve ser string");
        }

        const videoDatabase = new VideoDatabase();
        await videoDatabase.deleteVideo(idToDelete);

        res.status(201).send("Video deletado com sucesso!");
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
});