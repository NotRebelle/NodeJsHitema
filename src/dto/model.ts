export default interface modelDTO {
    name: string,
    title: string,
    artistId: string,
    url: string,
    valid: Number,
    rating: Array<object>,
    uploaded_at: Date,
    updated_at: Date
}
