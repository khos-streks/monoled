import jwt from 'jsonwebtoken'

export const tokenService = {
	generateAdminAccessToken(payload: object) {
		const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
			expiresIn: '6h'
		})

		return { accessToken }
	},

	validateAccessToken(token: string) {
		try {
			const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string)
			return userData
		} catch (e) {
			return null
		}
	}
}
