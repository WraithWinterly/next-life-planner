import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).send({ message: 'You need to be authenticated.' });
    return;
  }

  const tasks = await prisma?.task.findMany({
    where: {
      userId: session?.user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return res.send({
    content: tasks,
  });
}
