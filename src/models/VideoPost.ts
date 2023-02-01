export class VideoPost {

    constructor(
        private id: string,
        private title: string,
        private duration: string,
        private upload_at: string
    ) { }

    public getId(): string {
        return this.id;
    }
    public setId(value: string): void {
        this.id = value;
    }

    public getTitle(): string {
        return this.title;
    }
    public setTitle(value: string): void {
        this.title = value;
    }

    public getDuration(): string {
        return this.duration;
    }
    public setDuration(value: string): void {
        this.duration = value;
    }

    public getUploadedAt(): string {
        return this.upload_at;
    }
    public setUploadedAt(value: string): void {
        this.upload_at = value;
    }
}