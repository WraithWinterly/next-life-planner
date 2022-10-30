// This is an example of to protect an API route
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    res.status(401).send({
      message: 'You must be signed in to perform this action.',
    });
    return;
  }

  const tasks = await prisma?.everydayTask.findMany({
    where: {
      userId: session?.user.id,
    },
  });

  return res.send({
    content: tasks,
  });
}
5;
