const validator = require('validator')
const ContactUs = require('../../models/contactUsSchema')
const { sendEmail } = require('../../helpers/emailServices')

const AddContactUs = async (req, res) => {
    try {
        const { name, email, contact_no, subject } = req.body

        if (!name || !email || !contact_no || !subject) {
            return res.status(400).json({
                success: false,
                error: 'please fill out all fields'
            })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email'
            })
        }


        const contact = new ContactUs({
            name,
            contact_no,
            email,
            subject
        })

        const contactData = await contact.save()

        const content =
            `
      <p>Hii <b>` +
            contactData.name +
            `,</b> Your account is created, below is your details. </p>
      <table style="border-style:none">
        <tr>
          <th>Name:- </th>
          <td>` +
            contactData.name +
            `</td>
        </tr>

        <tr>
        <th>Email:- </th>
        <td>` +
            contactData.email +
            `</td>
      </tr>

       <tr>
        <th>Contact No:- </th>
        <td>` +
            contactData.contact_no +
            `</td>
      </tr>

      <tr>
        <th>Subject:- </th>
        <td>` +
            contactData.subject +
            `</td>
      </tr>

      
      </table>
      <p>Now you can login your account in our application, Thanks...</p>
      `;

        sendEmail(contactData.email, "Account created", content);

        return res.status(200).json({
            success: true,
            message: "create contact us successfully",
            data: contactData
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

module.exports = {
    AddContactUs
}