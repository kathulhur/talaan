import { HttpStatusCode } from "axios"

const isRequestSuccessful = (statusCode: number) => {
    return statusCode >= 200 && statusCode < 300
}

export default isRequestSuccessful
