using System.Text;

public class Solution {
    public int MyAtoi(string s)
    {
        int ans = 0;
        bool isPos = true;
        bool isFirst = true;
        int x = 0;
        foreach (var c in s)
        {
            if (c == ' ' && isFirst)
            {
                continue;
            }

            if (c == '+' && isFirst)
            {
                isFirst = false;
                continue;
            }

            if (c == '-' && isFirst)
            {
                isPos = false;
                isFirst = false;
                continue;
            }

            if (c > '9' || c < '0')
            {
                break;
            }

            else
            {
                x = Int32.Parse(c.ToString());
                isFirst = false;
            }
            if (ans > Int32.MaxValue / 10 ||(ans == Int32.MaxValue / 10 && x > 7))
            {
                return Int32.MaxValue;
            }

            if (ans < Int32.MinValue / 10 ||(ans == Int32.MinValue / 10 && x > 8))
            {
                return Int32.MinValue;
            }

            ans = ans * 10 + (isPos ? x : -x); 
            
        }
        return ans;
    }
}