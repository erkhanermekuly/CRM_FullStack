const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const auth = async (req, res, next) => {
    try {
        // Исправление опечатки в split
        let token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Токен не найден' });
        }

        // Проверка JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id,
            },
        });

        if (!user) {
            return res.status(401).json({ message: 'Пользователь не найден' });
        }

        req.user = user;

        // Переход к следующему middleware или контроллеру
        next();
    } catch (error) {
        res.status(401).json({ message: 'Не авторизован' });
    }
};

module.exports = {
    auth,
};
