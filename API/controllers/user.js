import {User} from '../Models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register =  async (req,res)=>{
    const {name,gmail,password} = req.body

   try {
    let user = await User.findOne({gmail})

    if(user) return res.json({message:"User Already exist"});

    const hashPass = await bcrypt.hash(password,10)

    user = await User.create({name,gmail,password:hashPass})

    res.json({message:"User Register Successfully..!",user})
    
   } catch (error) {
    res.json({message:error})
   }
}

export const login = async (req,res) =>{
    const {gmail,password} = req.body

    try {
        let user = await User.findOne({gmail});
        // console.log("User is coming from login ",user)

        if(!user) return res.json({message:"User not exist..!"})

        const validPass = await bcrypt.compare(password,user.password);

        if(!validPass) return res.json({message:"Invalid credentials"});
      
        const token = jwt.sign({userId:user._id},"!@#$%^&*()",{
            expiresIn:'1d'
        })

        res.json({message:`Welcome ${user.name}`,token})

    } catch (error) {
        res.json({message:error.message})
    }
}

export const profile = async (req,res) =>{
    res.json({user : req.user})
}

// Update User Settings
export const updateUserSettings = async (req, res) => {
    const userId = req.user;
    const { name, currentPassword, newPassword } = req.body;

    try {
        // Find the user by ID
        const user = await User.findById(userId);
        
        if (!user) {
            return res.json({ 
                status: 'error', 
                message: 'User not found' 
            });
        }

        let updateData = {};
        
        // Update name if provided
        if (name) {
            updateData.name = name;
        }
        
        // Change password if both currentPassword and newPassword are provided
        if (currentPassword && newPassword) {
            // Verify the current password
            const validPassword = await bcrypt.compare(currentPassword, user.password);
            
            if (!validPassword) {
                return res.json({ 
                    status: 'error', 
                    message: 'Current password is incorrect',
                    field: 'currentPassword'
                });
            }
            
            // Hash the new password
            const hashPass = await bcrypt.hash(newPassword, 10);
            updateData.password = hashPass;
        }
        
        // Update the user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        );
        
        res.json({
            status: 'success',
            message: 'User settings updated successfully',
            user: {
                _id: updatedUser._id,
                name: updatedUser.name,
                gmail: updatedUser.gmail
            }
        });
        
    } catch (error) {
        res.json({ 
            status: 'error', 
            message: error.message 
        });
    }
}