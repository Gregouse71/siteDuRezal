"""
MD4 Hashing Algorithm Implementation
Minimum Python Version: 3.8
"""
import sys
import os
from typing import Literal
import binascii
import argparse

_INPUT_TYPE = Literal["string", "file"]

# Global Constants
BLOCK_SIZE = 64 # 64 bytes, 512 bits
WORD_SIZE = 4 # 4 bytes, 32 bits
MASK = 0xFFFFFFFF

def fn_f(x, y, z):
    # if X then Y else Z
    return (x & y) | (~x & z)

def fn_g(x, y, z):
    # if at least 2 of X, Y, Z then 1 else 0
    return (x & y) | (x & z) | (y & z)

def fn_h(x, y, z):
    # X xor Y xor Z
    return x ^ y ^ z

def left_rotate(x, n):
    return (x << n) | (x >> (32 - n))

def append_pad_len(byte_arr):
    """
    (RFC 1320 Step 1 & 2)
    Appends the padding and length of original message length to the byte array

    Parameters:
        byte_arr: The byte array representation of string to append the padding and length to
    Returns:
        The byte array with padding and length appended
    """
    padding = bytearray(b"\x80") + bytearray(b"\x00" * 63) # creates a 512-bit block with 1 and 0s
    len_bits = len(byte_arr)
    index = len_bits % BLOCK_SIZE
    byte_arr += padding[0:56 - index] if index < 56 else padding[0:120 - index] # appends the padding to make the message length congruent to 448 mod 512
    byte_arr += (len_bits * 8).to_bytes(8, byteorder='little') # appends the length of the original message in bits
    return byte_arr

def process(byte_arr):
    """
    (RFC 1320 Step 3 & 4)
    Processes the padded message in 512-bit blocks

    Parameters:
        byte_arr: The byte array representation of the padded message
    Returns:
        The MD4 hash of the message in byte string
    """
    # Magic Constants
    A = 0x67452301
    B = 0xefcdab89
    C = 0x98badcfe
    D = 0x10325476

    for i in range(0, len(byte_arr), WORD_SIZE * 16):
        blocks = [int.from_bytes(byte_arr[i + j:i + j + WORD_SIZE], 'little') for j in range(0, BLOCK_SIZE, WORD_SIZE)] # 16 32-bit blocks

        AA = A
        BB = B
        CC = C
        DD = D

        # Round 1
        round1_steps = (3, 7, 11, 19)
        for j in range(0, 16, 4):
            A = left_rotate((A + fn_f(B, C, D) + blocks[j]) & MASK, round1_steps[j % 4])
            D = left_rotate((D + fn_f(A, B, C) + blocks[j + 1]) & MASK, round1_steps[(j + 1) % 4])
            C = left_rotate((C + fn_f(D, A, B) + blocks[j + 2]) & MASK, round1_steps[(j + 2) % 4])
            B = left_rotate((B + fn_f(C, D, A) + blocks[j + 3]) & MASK, round1_steps[(j + 3) % 4])

        # Round 2
        for j in range(4):
            A = left_rotate((A + fn_g(B, C, D) + blocks[j] + 0x5a827999)  & MASK, 3)
            D = left_rotate((D + fn_g(A, B, C) + blocks[j + 4] + 0x5a827999) & MASK, 5)
            C = left_rotate((C + fn_g(D, A, B) + blocks[j + 8] + 0x5a827999) & MASK, 9)
            B = left_rotate((B + fn_g(C, D, A) + blocks[j + 12] + 0x5a827999) & MASK, 13)

        # Round 3
        round3_blocks = ((0, 8, 4, 12), (2, 10, 6, 14), (1, 9, 5, 13), (3, 11, 7, 15))
        for j in range(4):
            A = left_rotate((A + fn_h(B, C, D) + blocks[round3_blocks[j][0]] + 0x6ed9eba1) & MASK, 3)
            D = left_rotate((D + fn_h(A, B, C) + blocks[round3_blocks[j][1]] + 0x6ed9eba1) & MASK, 9)
            C = left_rotate((C + fn_h(D, A, B) + blocks[round3_blocks[j][2]] + 0x6ed9eba1) & MASK, 11)
            B = left_rotate((B + fn_h(C, D, A) + blocks[round3_blocks[j][3]] + 0x6ed9eba1) & MASK, 15)

        A = (A + AA) & MASK
        B = (B + BB) & MASK
        C = (C + CC) & MASK
        D = (D + DD) & MASK

    return A.to_bytes(4, byteorder='little') + B.to_bytes(4, byteorder='little') + C.to_bytes(4, byteorder='little') + D.to_bytes(4, byteorder='little')

def md4(cleartext, input_type: _INPUT_TYPE):
    """
    Parameters:
        cleartext: The string or byte array to hash
        input_type: The type of input provided (string or file)
    Returns:
        The MD4 hash of the input as a 128-bit long hex string
    """
    byte_arr = bytearray(cleartext, "utf-8") if input_type == "string" else bytearray(cleartext)
    byte_arr = append_pad_len(byte_arr)
    msg_digest = process(byte_arr)
    return binascii.hexlify(msg_digest).decode("utf-8")