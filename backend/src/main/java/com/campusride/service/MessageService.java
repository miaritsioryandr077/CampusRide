package com.campusride.service;

import com.campusride.dto.MessageDto;
import com.campusride.entity.Message;
import com.campusride.entity.User;
import com.campusride.repository.MessageRepository;
import com.campusride.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public MessageDto saveMessage(MessageDto request, String senderEmail) {
        User sender = userRepository.findByEmail(senderEmail).orElseThrow();
        
        Message message = Message.builder()
                .rideId(request.getRideId())
                .sender(sender)
                .content(request.getContent())
                .build();
                
        return mapToDto(messageRepository.save(message));
    }

    public List<MessageDto> getMessagesForRide(Long rideId) {
        return messageRepository.findByRideIdOrderByTimestampAsc(rideId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }
    
    private MessageDto mapToDto(Message message) {
        return MessageDto.builder()
                .id(message.getId())
                .rideId(message.getRideId())
                .senderId(message.getSender().getId())
                .senderName(message.getSender().getFirstName() + " " + message.getSender().getLastName())
                .content(message.getContent())
                .timestamp(message.getTimestamp())
                .build();
    }
}
