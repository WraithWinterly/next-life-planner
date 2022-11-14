import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

import type { NextApiRequest, NextApiResponse } from 'next';
import { requireSignIn } from '@/src/utils/apiUtils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    requireSignIn(session);

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
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message });
  }
}
