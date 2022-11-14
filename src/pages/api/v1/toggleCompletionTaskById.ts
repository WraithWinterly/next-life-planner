import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

import type { NextApiRequest, NextApiResponse } from 'next';
import { requirePost, requireSignIn } from '@/src/utils/apiUtils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    requirePost(req);
    requireSignIn(session);

    const id = req.body as string;

    const taskData = await prisma?.task.findUnique({
      where: {
        id: id,
      },
    });

    if (!taskData) {
      res.status(400).send({ message: 'Task name is required' });
      return;
    }

    if (taskData?.userId !== session?.user.id) {
      res.status(401).send({
        message: 'You are not authorized to edit this task.',
      });
      return;
    }

    await prisma?.task.update({
      where: {
        id: id,
      },
      data: {
        completed: !taskData.completed,
      },
    });

    return res.send({
      content: true,
    });
  } catch (error) {
    return res.status(500).send({ message: (error as Error).message });
  }
}
