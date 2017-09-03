export class DragDataService {
    private data: any = null;

    public getData(): any {
        return this.data;
    }

    public setData(data: any): void {
        this.data = data;
    }

    public reset(): void {
        this.setData(null);
    }
}

export let dragDataService: DragDataService = new DragDataService();