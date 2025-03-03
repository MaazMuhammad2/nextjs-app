import dbConnect from "@/lib/dbConnect";
import User from "@/model/User.model";
import {Message} from '@/model/User.model'

export async function POST(request: Request){
    await dbConnect()

    try {

        const {username, content} = await request.json()
        const user = await User.findOne(username)
        if (!user) {
            return Response.json(
                {
                  success: false,
                  message: "User not found",
                },
                { status: 404 }
              );
        }

        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                  success: false,
                  message: "User is not accepting messages",
                },
                { status: 403 }
              );
        }
        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message)
        await user.save()
        return Response.json(
            {
              success: true,
              message: "message sent successfully"
            },
            { status: 401 }
          );

    } catch (error) {
        console.log("Error adding messages", error)
        return Response.json(
            {
              success: false,
              message: "Internal server error",
            },
            { status: 500 }
          );
    }
}
