public class Solution
{
    public string LongestPalindrome(string s)
    {
        int length = s.Length;
        if (length < 2)
        {
            return s;
        }

        int max = 1;
        int mL = 0;
        int mR = 0;

        for (int now = 0; now < length; now++)
        {
            Expand(s, now, now, ref max, ref mL, ref mR);
            Expand(s, now, now + 1, ref max, ref mL, ref mR);
        }

        return s.Substring(mL, mR - mL + 1);
    }

    private void Expand(string s, int left, int right, ref int max, ref int mL, ref int mR)
    {
        while (left >= 0 && right < s.Length && s[left] == s[right])
        {
            int len = right - left + 1;
            if (len > max)
            {
                max = len;
                mL = left;
                mR = right;
            }

            left--;
            right++;
        }
    }
}