const formatEmailFromPost = (post) => {
    const subject = `New Offer: ${post.caption}`;
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.05); text-align: center;">
          <h1 style="color: #333;">${post.caption}</h1>
          ${post.mediaUrl ? `<img src="${post.mediaUrl}" style="max-width: 100%; border-radius: 8px;" alt="Offer Image" />` : ""}
          <p style="font-size: 16px; color: #555;">Check out our latest offer!</p>
          <a href="${post.link}" style="display: inline-block; margin-top: 15px; padding: 12px 20px; background: #007BFF; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
            ${post.callToAction}
          </a>
        </div>
      </div>
    `;
    return { subject, html };
};


module.exports = formatEmailFromPost;
