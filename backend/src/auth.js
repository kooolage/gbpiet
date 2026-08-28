const express = require('express');
const firebaseAuth = require('./firebaseAdmin');

const router = express.Router();

router.post('/google', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Authentication token missing.',
      });
    }

    const idToken = authHeader.substring(7);

    const decodedToken = await firebaseAuth.verifyIdToken(idToken);

    return res.json({
      success: true,
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      name: decodedToken.name || null,
      picture: decodedToken.picture || null,
    });
  } catch (error) {
    console.error('Firebase verification failed:', error);

    return res.status(401).json({
      message: 'Invalid or expired Firebase authentication token.',
    });
  }
});

module.exports = router;