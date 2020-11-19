import unittest
import picture


class TestMyModule (unittest.TestCase):

    
    def test_picture(self):
        self.assertEqual(picture.show_picture("../../../media/1.png"),0)


if __name__ == "__main__":
    unittest.main()