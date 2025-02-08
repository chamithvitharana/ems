package com.ems.commonlib;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

public class Util {

    public static byte[] toByteArray(ByteArrayInputStream inputStream) {
        try {
            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            byte[] data = new byte[1024];
            int nRead;
            while ((nRead = inputStream.read(data, 0, data.length)) != -1) {
                buffer.write(data, 0, nRead);
            }
            return buffer.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error while converting input stream to byte array", e);
        }
    }

}
