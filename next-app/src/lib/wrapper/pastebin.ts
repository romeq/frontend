interface User {
    username: string
    banned: boolean
    meta: {
        pic: string
        bio: string
    }
}
interface WrapperError {
    message: string
}

interface PasteCreated {
    id: string
    delete?: string
    language?: string
}

class Pastebin {
    apiInstance: string

    constructor() {
        this.apiInstance = "http://localhost:8080"
    }

    async getProfile(): Promise<User | undefined> {
        try {
            const req = await fetch(`${this.apiInstance}/users/me`, { credentials: "include" })
            if (!req.ok) return undefined
            return await req.json()
        } catch (e) {
            return undefined
        }
    }

    async register(props: { username: string; email: string; password: string }): Promise<boolean> {
        try {
            const req = await fetch(`${this.apiInstance}/users/create`, {
                method: "post",
                body: JSON.stringify(props),
                credentials: "include",
                headers: new Headers({ "content-type": "application/json" }),
            })
            return req.ok
        } catch (e) {
            return false
        }
    }

    async logout() {
        await fetch(`${this.apiInstance}/users/logout`, { credentials: "include" })
    }

    async login(props: { username: string; password: string }): Promise<boolean> {
        try {
            const req = await fetch(`${this.apiInstance}/users/login`, {
                method: "post",
                body: JSON.stringify(props),
                credentials: "include",
                headers: new Headers({ "content-type": "application/json" }),
            })
            return req.ok
        } catch (e) {
            return false
        }
    }

    async createPaste(props: { title: string; paste: string; private: boolean }): Promise<PasteCreated | string> {
        try {
            const req = await fetch(`${this.apiInstance}/pastes`, {
                method: "post",
                body: JSON.stringify(props),
                credentials: "include",
                headers: new Headers({ "content-type": "application/json" }),
            })

            if (req.ok) return await req.json()
            else if (req.status === 409) return { id: (await req.json()).data.pasteIdentifier }
            return undefined
        } catch (e) {
            return undefined
        }
    }
}

const defaultWrapper = new Pastebin()
export type { User, WrapperError }
export { Pastebin, defaultWrapper }
