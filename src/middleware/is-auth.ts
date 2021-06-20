import jwt from 'jsonwebtoken'

module.exports = (
  req: { get: (arg0: string) => any; isAuth: boolean; userId: unknown },
  res: any,
  next: () => any
) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    req.isAuth = false
    return next()
  }
  const token = authHeader.split(' ')[1]
  if (!token || token === '') {
    req.isAuth = false
    return next()
  }

  let decodedToken
  try {
    decodedToken = jwt.verify(token, `${process.env.JWT_KEY}`)
  } catch (err) {
    req.isAuth = false
    return next()
  }
  if (!decodedToken) {
    req.isAuth = false
    return next()
  }
  req.isAuth = true
  req.userId = decodedToken.userId
  next()
}
