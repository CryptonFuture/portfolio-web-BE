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

const getContactUs = async (req, res) => {
    try {
        const contact = await ContactUs.find()

        if (!contact.length > 0) {
            return res.status(404).json({
                success: false,
                error: "No contact us found"
            })
        }

        return res.status(200).json({
            success: true,
            data: contact
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

const getContactUsById = async (req, res) => {
    try {
        const { id } = req.params
        const contact = await ContactUs.find({ _id: id })

        if (!contact) {
            return res.status(404).json({
                success: false,
                error: "No contact us Id found"
            })
        }

        return res.status(200).json({
            success: true,
            data: contact
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

// Hard Delete
const deleteContactUs = async (req, res) => {
    try {
        const { id } = req.params

        const contact = await ContactUs.findByIdAndDelete({ _id: id })

        if (!contact) {
            return res.status(404).json({
                success: false,
                error: "No contact us Id found"
            })
        } else {
            return res.status(200).json({
                success: true,
                data: contact,
                message: 'Delete Contact Us Successfully'
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

// soft Delete
const deleteContact = async (req, res) => {
    try {
        const { id } = req.params

        const contact = await ContactUs.findByIdAndUpdate({ _id: id }, { is_deleted: 1 })

        if (!contact) {
            return res.status(404).json({
                success: false,
                error: "No contact us Id found"
            })
        } else {
            return res.status(200).json({
                success: true,
                data: contact,
                message: 'Delete Contact Us Successfully'
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

const countContactUs = async (req, res) => {
    try {
        const countContact = await ContactUs.countDocuments()
        return res.status(200).json({
            success: true,
            count: countContact
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "internal server error"
        });
    }
}

const UpdateContactUs = async (req, res) => {
    try {
        const { id } = req.params

        const { name, email, contact_no, subject } = req.body;

        if (!name || !email || !contact_no || !subject) {
            return res.status(400).json({
                success: false,
                error: 'Please provide all required fields including the ID',
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid email',
            });
        }

        const updatedContact = await ContactUs.findByIdAndUpdate(
            { _id: id },
            { name, email, contact_no, subject },
            { new: true }
        );

        if (!updatedContact) {
            return res.status(404).json({
                success: false,
                error: 'Contact not found',
            });
        }

        const content = `
      <p>Hi <b>${updatedContact.name},</b> Your account details have been updated successfully. Below are your updated details:</p>
      <table style="border-style:none">
        <tr>
          <th>Name: </th>
          <td>${updatedContact.name}</td>
        </tr>
        <tr>
          <th>Email: </th>
          <td>${updatedContact.email}</td>
        </tr>
        <tr>
          <th>Contact No: </th>
          <td>${updatedContact.contact_no}</td>
        </tr>
        <tr>
          <th>Subject: </th>
          <td>${updatedContact.subject}</td>
        </tr>
      </table>
      <p>If you did not request this update, please contact our support team immediately.</p>
    `;

        sendEmail(updatedContact.email, "Account Updated", content);

        return res.status(200).json({
            success: true,
            message: "Contact updated successfully",
            data: updatedContact,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: "Internal server error",
        });
    }
};


module.exports = {
    AddContactUs,
    getContactUs,
    deleteContactUs,
    UpdateContactUs,
    getContactUsById,
    countContactUs,
    deleteContact
}